import {NewCardForm} from "../Designs/cardTemplate.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CreditCard from "../Model/card";
import {repo} from "../LocalStorage/repository";
import {authFetch} from "../Utils/autoFetch";

const API_GET_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/credit-cards`;

export default function EditCard() {

    const history = useNavigate();
    const {cardId} = useParams();

    const [creditCard, setCreditCard] = useState(new CreditCard());
    // Initialize state variables for each input field
    const [cardNumber, setCardNumber] = useState(creditCard ? creditCard.number : "");
    const [cardHolder, setCardHolder] = useState(creditCard ? creditCard.placeHolder : "");
    const [expiry, setExpiry] = useState(creditCard ? creditCard.stringifyExpirationDate() : "");
    const [cvv, setCvv] = useState(creditCard ? creditCard.cvv : "");
    const [cardType, setCardType] = useState(creditCard ? creditCard.type : "");

    if (!creditCard.isTruthy()) {
        const localCreditCard = new CreditCard(repo.getCardById(cardId));
        setCardNumber(localCreditCard.number);
        setCardHolder(localCreditCard.placeHolder);
        setCardType(localCreditCard.type);
        setExpiry(localCreditCard.stringifyExpirationDate());
        setCvv(localCreditCard.cvv);
        setCreditCard(localCreditCard)
    }

    useEffect(() => {
        authFetch(API_GET_URL + `/${cardId}`)
            .then(response => response.json())
            .then(data => {
                const localCreditCard = new CreditCard(data.card);
                setCardNumber(localCreditCard.number);
                setCardHolder(localCreditCard.placeHolder);
                setExpiry(localCreditCard.stringifyExpirationDate());
                setCvv(localCreditCard.cvv);
                setCardType(localCreditCard.type);
                setCreditCard(localCreditCard)
            }).catch((error) => {
                // console.error('Error:', error);
            });
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        creditCard.number = cardNumber;
        creditCard.placeHolder = cardHolder;
        creditCard.cvv = cvv;
        creditCard.type = cardType;
        creditCard.setExpirationDate(expiry);

        console.log(JSON.stringify({card: creditCard}));

        function operation(API_GET_URL, cardId, creditCard) {
            authFetch(API_GET_URL + `/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({card: creditCard}),
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        const fctArgs = [API_GET_URL, cardId, creditCard];
        repo.updateCard(creditCard);

        if (repo.isServerOnline()) {
            operation(...fctArgs);
        } else {
            repo.addOperation(operation, fctArgs);
        }

        history('/cards');
    }

    if (!creditCard) {
        return <h1>Card not found</h1>;
    }


    return NewCardForm(creditCard, handleSubmit, setCardNumber, setCardHolder, setExpiry, setCvv, setCardType);
}