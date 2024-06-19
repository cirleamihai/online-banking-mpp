import React, {useEffect, useState} from 'react';
import "../../Designs/form.css";
import {fetchAPIObjects} from "../../Utils/backendHandlers";
import CreditCard from "../../Model/card";
import Purchase from "../../Model/purchase";
import {useNavigate} from "react-router-dom";
import {repo} from "../../LocalStorage/repository";
import {authFetch} from "../../Utils/autoFetch";

const API_GET_ALL_CARDS_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/credit-cards`;

const validate = (values) => {
    const errors = {};
    const totalValue = Number(values.totalValue);

    if (!values.totalValue) {
        errors.totalValue = "Total Value is required";
    } else if (!totalValue) {
        errors.totalValue = "Total Value must be a number";
    } else if (totalValue < 0) {
        errors.totalValue = "Total Value must be greater than 0";
    }
    if (!values.merchant) {
        errors.merchant = "Merchant is required";
    }

    return errors;
};


function AddPurchase() {
    const [localCards, setLocalCards] = useState([]);
    const [formData, setFormData] = useState({
        totalValue: '',
        merchant: '',
        cardID: ''
    });
    const [errors, setErrors] = useState({});
    let history = useNavigate();

    if (formData.cardID === '') {
        if (localCards.length > 0) {
            setFormData((prev) => ({
                ...prev,
                cardID: localCards[0].id,
                cardNumber: localCards[0].number
            }));
        }
    }

    useEffect(() => {
        const fetcherArgs = [API_GET_ALL_CARDS_URL, setLocalCards, "cards", CreditCard];
        fetchAPIObjects(...fetcherArgs).then(() => {

        });

    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length === 0) {
            for (let card in localCards) {
                if (card.id === formData.cardID) {
                    formData.cardNumber = card.number;
                    break;
                }
            }
            const operation = (formData) => {
                authFetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/purchases/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({purchase: new Purchase(formData)}),
                }).then((response) => {
                    if (response.ok) {
                        console.log("Purchase added successfully");
                    } else {
                        console.log("Purchase not added");
                    }
                });
            }
            const args = [formData];

            if (repo.isServerOnline()) {
                operation(...args);
            } else {
                repo.addOperation(operation, args);
                repo.addPurchase(new Purchase(formData));
            }

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            sleep(1).then(() => {
                history('/purchases');
            });
        } else {
            console.log("onError", validationErrors);
            setErrors(validationErrors);
        }
    };

    return (
        <form noValidate onSubmit={handleSubmit}>
            <div>
                <input
                    name="totalValue"
                    placeholder="Total Value"
                    required
                    value={formData.totalValue}
                    onChange={handleInputChange}
                />
                {errors.totalValue && <p>{errors.totalValue}</p>}
            </div>
            <div>
                <input
                    name="merchant"
                    placeholder="Merchant"
                    required
                    value={formData.merchant}
                    onChange={handleInputChange}
                />
                {errors.merchant && <p>{errors.merchant}</p>}
            </div>
            <select
                name="cardID"
                value={formData.cardID}
                onChange={handleInputChange}
            >
                {localCards.map((card) => (
                    <option key={card.id} value={card.id}>
                        {card.purchaseOptionDisplayer()}
                    </option>
                ))}
            </select>
            <input type="submit"/>
        </form>
    );
}

export default AddPurchase;
