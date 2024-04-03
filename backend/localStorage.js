const { v4: uuidv4 } = require('uuid');
const CreditCard = require('./cardModel.js');

const databaseCards = [
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
    },
    {
        "id": uuidv4(),
        "title": "Shopping Rewards",
        "type": "Visa",
        "placeHolder": "Alice Johnson",
        "number": "1122 3344 5566 7788",
        "expiryMo": 5,
        "expiryYr": 28,
        "cvv": "987"
    },
    {
        "id": uuidv4(),
        "title": "Family Expenses",
        "type": "MasterCard",
        "placeHolder": "Michael Smith",
        "number": "5432 1098 7654 3210",
        "expiryMo": 11,
        "expiryYr": 29,
        "cvv": "456"
    },
    {
        "id": uuidv4(),
        "title": "Travel Rewards",
        "type": "Visa",
        "placeHolder": "Emily Davis",
        "number": "7654 3210 9876 5432",
        "expiryMo": 8,
        "expiryYr": 30,
        "cvv": "789"
    },
    {
        "id": uuidv4(),
        "title": "Online Purchases",
        "type": "MasterCard",
        "placeHolder": "John Anderson",
        "number": "0987 6543 2109 8765",
        "expiryMo": 2,
        "expiryYr": 31,
        "cvv": "234"
    },
    {
        "id": uuidv4(),
        "title": "Emergency Fund",
        "type": "Visa",
        "placeHolder": "Sarah Williams",
        "number": "1111 2222 3333 4444",
        "expiryMo": 7,
        "expiryYr": 32,
        "cvv": "567"
    },
    {
        "id": uuidv4(),
        "title": "Business Travel",
        "type": "MasterCard",
        "placeHolder": "Robert Brown",
        "number": "2222 3333 4444 5555",
        "expiryMo": 10,
        "expiryYr": 33,
        "cvv": "890"
    },
    {
        "id": uuidv4(),
        "title": "Charity Donations",
        "type": "Visa",
        "placeHolder": "Jessica Lee",
        "number": "3333 4444 5555 6666",
        "expiryMo": 4,
        "expiryYr": 34,
        "cvv": "123"
    },
    {
        "id": uuidv4(),
        "title": "Entertainment",
        "type": "MasterCard",
        "placeHolder": "David Wilson",
        "number": "4444 5555 6666 7777",
        "expiryMo": 1,
        "expiryYr": 35,
        "cvv": "456"
    },
    {
        "id": uuidv4(),
        "title": "Personal Savings",
        "type": "Visa",
        "placeHolder": "Jennifer Martinez",
        "number": "5555 6666 7777 8888",
        "expiryMo": 9,
        "expiryYr": 36,
        "cvv": "789"
    },
    {
        "id": uuidv4(),
        "title": "Vacation Fund",
        "type": "MasterCard",
        "placeHolder": "Christopher Taylor",
        "number": "6666 7777 8888 9999",
        "expiryMo": 12,
        "expiryYr": 37,
        "cvv": "012"
    }
]

const localCards = databaseCards.map(card => {
    return new CreditCard(card)
});

module.exports = localCards;
