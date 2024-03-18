import {viewCard} from "../Designs/cardTemplate.tsx";
import {useParams} from "react-router-dom";
import {localCards} from "../LocalData/localCards.tsx";

export default function ViewCard() {
    const {cardId} = useParams();
    const creditCard = localCards.find(card => card.objectId === cardId);

    if (!creditCard) {
        return <h1>Card not found</h1>;
    }

    return viewCard(creditCard);
}