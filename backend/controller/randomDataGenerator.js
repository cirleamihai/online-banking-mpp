const { v4: uuidv4 } = require('uuid');
const CreditCard = require('../models/cardModel.js');
const {addData} = require("../database/databaseHandler.js");
const {addDataArray} = require("../database/databaseHandler"); // Adjust the path as necessary

function generateRandomCreditCard() {
    // Predefined lists of data
    const firstNames = [
        "Emma",
        "Liam",
        "Olivia",
        "Noah",
        "Ava",
        "William",
        "Isabella",
        "James",
        "Sophia",
        "Oliver",
        "Charlotte",
        "Benjamin",
        "Mia",
        "Elijah",
        "Amelia",
        "Lucas",
        "Harper",
        "Mason",
        "Evelyn",
        "Logan",
        "Abigail",
        "Alexander",
        "Emily",
        "Ethan",
        "Elizabeth",
        "Jacob",
        "Sofia",
        "Michael",
        "Avery"
    ];
    const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Hernandez",
        "Lopez",
        "Gonzalez",
        "Wilson",
        "Anderson",
        "Thomas",
        "Taylor",
        "Moore",
        "Jackson",
        "Martin",
        "Lee",
        "Perez",
        "Thompson",
        "White",
        "Harris",
        "Sanchez",
        "Clark",
        "Ramirez",
        "Lewis",
        "Robinson"
    ];
    const cardTypes = ['Visa', 'MasterCard'];
    const months = [...Array(12).keys()].map(x => x + 1); // Generates numbers 1 to 12 for months

    // Function to generate random elements from the lists
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const placeHolder = getRandomElement(firstNames) + ' ' + getRandomElement(lastNames);

    // Creating a random CreditCard object
    const card = {
        id: uuidv4(), // Simple random ID generator
        title: placeHolder + " Card",
        type: getRandomElement(cardTypes),
        number: Math.floor(Math.random() * 9000 + 1000) + ' ' + Math.floor(Math.random() * 9000 + 1000) + ' ' + Math.floor(Math.random() * 9000 + 1000) + ' ' + Math.floor(Math.random() * 9000 + 1000), // Generates a 16-digit card number
        placeHolder: placeHolder,
        expiryMo: getRandomElement(months),
        expiryYr: Math.floor(Math.random() * 10 + 20), // Generates a year between 2020 and 2029
        cvv: Math.floor(Math.random() * 900 + 100).toString(), // Generates a 3-digit CVV
    };

    return new CreditCard(card);
}

// for (let j = 0; j < 50; ++j) {
//     const dataArr = [];
//     for (let i = 0; i < 1000; ++i) {
//         dataArr.push(generateRandomCreditCard());
//     }
//     addDataArray('creditCards', dataArr);
// }

// Example usage
module.exports = generateRandomCreditCard;
