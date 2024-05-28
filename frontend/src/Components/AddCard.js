import {NewCardForm} from '../Designs/cardTemplate.tsx'
import CreditCard from "../Model/card";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {v4 as uuidv4} from 'uuid';
import {repo} from "../LocalStorage/repository";
import {authFetch} from "../Utils/autoFetch";

const API_ADD_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/credit-cards`;

export default function AddCard() {
    let creditCard = undefined; // Create a new credit card object

    // Initialize state variables for each input field
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardType, setCardType] = useState("");

    let history = useNavigate();

    const handleSubmit = (e, doc) => {
        e.preventDefault();

        if (cardNumber === "" || cardHolder === "" || expiry === "" || cvv === "" || cardType === "") {
            alert("Please fill in all the fields");
            return;
        }

        // Create a new credit card object
        creditCard = new CreditCard();

        // Set the values of the credit card object
        creditCard.number = cardNumber;
        creditCard.placeHolder = cardHolder;
        creditCard.cvv = cvv;
        creditCard.type = cardType;
        creditCard.setExpirationDate(expiry);
        creditCard.id = uuidv4();
        creditCard.title = cardHolder.split(" ")[0] + " Card";
        console.log(creditCard);

        function operation(API_ADD_URL, creditCard)
        {
            // Add the credit card to the local storage
            authFetch(API_ADD_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({card: creditCard}),
            }).then(() => {
                console.log("Card added successfully");
            })
        }

        repo.addCard(creditCard);
        const args = [API_ADD_URL, creditCard];
        if (repo.isServerOnline()) {
            operation(...args);
        } else {
            repo.addOperation(operation, args);
        }
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        sleep(1).then(() => {
            history('/cards');
        });
    }

    return NewCardForm(creditCard, handleSubmit, setCardNumber, setCardHolder, setExpiry, setCvv, setCardType);
}
