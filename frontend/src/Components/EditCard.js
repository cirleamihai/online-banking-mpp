import {NewCardForm} from "../Designs/cardTemplate.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CreditCard from "../Model/card";
import {repo} from "../LocalStorage/repository";
import {authFetch} from "../Utils/autoFetch";
import {CardComponent} from "./CardComponent";

const API_GET_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/credit-cards`;

export default function EditCard() {
    const history = useNavigate();
    const {cardId} = useParams();
    const [creditCard, setCreditCard] = useState(new CreditCard());

    if (!creditCard.isTruthy()) {
        const card = repo.getCardById(cardId);
        if (card) {
            setCreditCard(card);
        }
    }

    useEffect(() => {
        authFetch(API_GET_URL + `/${cardId}`)
            .then(response => response.json())
            .then(data => {
                const localCreditCard = new CreditCard(data.card);
                setCreditCard(localCreditCard);
            }).catch((error) => {
                // console.error('Error:', error);
            });
    }, []);


    const handleSubmit = (e, card, errors) => {
        e.preventDefault();

        for (const key in errors) {
            if (errors[key]) {
                alert(errors[key]);
                return;
            }
        }

        // Create a new credit card object
        const localCreditCard = new CreditCard(card);
        localCreditCard.id = cardId;

        function operation(API_GET_URL, cardId, localCreditCard) {
            authFetch(API_GET_URL + `/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({card: localCreditCard}),
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        const fctArgs = [API_GET_URL, cardId, localCreditCard];
        repo.updateCard(localCreditCard);

        if (repo.isServerOnline()) {
            operation(...fctArgs);
        } else {
            repo.addOperation(operation, fctArgs);
        }

        history('/cards');
    }

    if (!creditCard.isTruthy()) {
        return <h1>Card not found</h1>;
    }


    return (
        <CardComponent onSaveClick={handleSubmit} myCard={creditCard} editable={true}/>
    )
}