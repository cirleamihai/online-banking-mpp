import {NewCardForm} from "../Designs/cardTemplate.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {localCards} from "../LocalData/localCards.tsx";
import {useState} from "react";

export default function EditCard() {
    const {cardId} = useParams();
    const creditCard = localCards.find(card => card.objectId === cardId);

    // Initialize state variables for each input field
    const [cardNumber, setCardNumber] = useState(creditCard ? creditCard.cardNumber : "");
    const [cardHolder, setCardHolder] = useState(creditCard ? creditCard.cardPlaceHolder : "");
    const [expiry, setExpiry] = useState(creditCard ? creditCard.stringifyExpirationDate() : "");
    const [cvv, setCvv] = useState(creditCard ? creditCard.cvv : "");
    const [cardType, setCardType] = useState(creditCard ? creditCard.cardType : "");

    let history = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        creditCard.cardNumber = cardNumber;
        creditCard.cardPlaceHolder = cardHolder;
        creditCard.cvv = cvv;
        creditCard.cardType = cardType;
        creditCard.setExpirationDate(expiry);

        history("/");
    }

    if (!creditCard) {
        return <h1>Card not found</h1>;
    }


    return NewCardForm(creditCard, handleSubmit, setCardNumber, setCardHolder, setExpiry, setCvv, setCardType);
}