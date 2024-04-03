import {viewCard} from "../Designs/cardTemplate.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CreditCard from "../Model/card";

const API_GET_URL = 'http://localhost:8000/api/v1/credit-cards';

export default function ViewCard() {
    const {cardId} = useParams();

    const [creditCard, setCreditCard] = useState(new CreditCard());

    useEffect(() => {
        fetch(API_GET_URL + `/${cardId}`)
            .then(response => response.json())
            .then(data => setCreditCard(new CreditCard(data.card)));
    }, []);

    if (!creditCard.isTruthy()) {
        return <h1>Card not found</h1>;
    }

    return viewCard(creditCard);
}