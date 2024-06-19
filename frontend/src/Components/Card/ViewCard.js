import {viewCard} from "../../Designs/cardTemplate.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CreditCard from "../../Model/card";
import {repo} from "../../LocalStorage/repository";
import {authFetch} from "../../Utils/autoFetch";
import {CardComponent} from "./CardComponent";

const API_GET_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/credit-cards`;

export default function ViewCard() {
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
            .then(data => setCreditCard(new CreditCard(data.card)))
            .catch(error => {
                // console.error('Error:', error);
            });
    }, []);

    if (!creditCard.isTruthy()) {
        return <h1>Card not found</h1>;
    }

    return (
        <CardComponent myCard={creditCard} editable={false}/>);
}