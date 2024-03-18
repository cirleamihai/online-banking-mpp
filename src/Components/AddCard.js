import {NewCardForm} from '../Designs/cardTemplate.tsx'
import CreditCard from "../Model/card";
import {localCards} from "../LocalData/localCards.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {v4 as uuidv4} from 'uuid';

export default function AddCard(testing) {
  let creditCard = undefined; // Create a new credit card object

  // Initialize state variables for each input field
  const [cardNumber, setCardNumber] = useState( "");
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
    creditCard.cardNumber = cardNumber;
    creditCard.cardPlaceHolder = cardHolder;
    creditCard.cvv = cvv;
    creditCard.cardType = cardType;
    creditCard.setExpirationDate(expiry);
    creditCard.objectId = uuidv4();
    creditCard.cardTitle = cardHolder.split(" ")[0] + "'s Card";
    console.log(creditCard);

    // Add the credit card to the local storage
    localCards.push(creditCard);

    history('/');
  }

  return NewCardForm(creditCard, handleSubmit, setCardNumber, setCardHolder, setExpiry, setCvv, setCardType);
}
