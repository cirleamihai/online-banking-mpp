import {v4 as uuidv4} from 'uuid';
import CreditCard from "../Model/card.js";

export const databaseCards = [
    {
        "id": uuidv4(),
        "title": "MyCard",
        "type": "Visa",
        "placeHolder": "Emanuel Rodrigo",
        "number": "1234 5678 9101 1121",
        "expiryMo": 1,
        "expiryYr": 23,
        "cvv": "745"
    },
    {
        "id": uuidv4(),
        "title": "Daniels Card",
        "type": "MasterCard",
        "placeHolder": "Daniel Oluwaseun",
        "number": "9821 5678 0111 0222",
        "expiryMo": 9,
        "expiryYr": 24,
        "cvv": "123"
    },
    {
        "id": uuidv4(),
        "title": "Travel Plus",
        "type": "MasterCard",
        "placeHolder": "Sam Dingo",
        "number": "3344 5566 7788 9900",
        "expiryMo": 12,
        "expiryYr": 25,
        "cvv": "678"
    },
    {
        "id": uuidv4(),
        "title": "Business Exp",
        "type": "Visa",
        "placeHolder": "Josh Buaca",
        "number": "4557 6655 8912 0022",
        "expiryMo": 6,
        "expiryYr": 26,
        "cvv": "432"
    },
    {
        "id": uuidv4(),
        "title": "Grocery Saver",
        "type": "MasterCard",
        "placeHolder": "Tino Dabossa",
        "number": "9988 7766 5544 3322",
        "expiryMo": 3,
        "expiryYr": 27,
        "cvv": "221"
    }
]

export const localCards = databaseCards.map(card => {
    return new CreditCard(card)
});
