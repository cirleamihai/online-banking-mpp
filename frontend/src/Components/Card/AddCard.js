import CreditCard from "../../Model/card";
import {useNavigate} from "react-router-dom";
import {repo} from "../../LocalStorage/repository";
import {authFetch} from "../../Utils/autoFetch";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import '../../Designs/cardDesign.css'
import {CardComponent} from "./CardComponent";

const API_ADD_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/credit-cards`;

export function AddCard() {

    let history = useNavigate();

    const handleSubmit = (e, card, errors) => {
        e.preventDefault();

        for (const key in errors) {
            if (errors[key]) {
                alert(errors[key]);
                return;
            }
        }

        // Create a new credit card object
        const creditCard = new CreditCard(card);

        function operation(API_ADD_URL, creditCard) {
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

    return CardComponent({onSaveClick: handleSubmit});
}



