const database = require("../database/databaseHandler");
const CreditCard = require("../models/cardModel");
const Purchase = require("../models/purchasesModel");

let creditCards = [];
let purchases = [];

async function loadData() {
    const creditCardsDB = await database.fetchData('CardsWithUsage');
    const purchasesDB = await database.fetchData('purchases');

    creditCards = creditCardsDB.map((card) => {
        const localCC = new CreditCard();
        localCC.loadFromSQLDatabase(card);
        return localCC
    });
    purchases = purchasesDB.map((purchase) => {
        const localPurchase = new Purchase();
        localPurchase.loadFromSQLDatabase(purchase);
        return localPurchase;
    });
}

function getCreditCards() {
    loadData().then(() => {
        // loaded data
    });

    return creditCards;
}

function getPurchases() {
    loadData().then(() => {
        // loaded data
    });

    return purchases;
}

function getCreditCardByID(id) {
    return database.getObjectByID('creditCards', id).then((card) => {
        const creditCard = new CreditCard();
        if (card[0]) {
            creditCard.loadFromSQLDatabase(card[0]);
        }
        return creditCard;
    });
}

function getPurchaseByID(id) {
    return database.getObjectByID('purchases', id).then((purchase) => {
        const localPurchase = new Purchase();
        if (purchase[0]) {
            localPurchase.loadFromSQLDatabase(purchase[0]);
        }
        return localPurchase;
    });
}

module.exports = {
    loadData,
    getCreditCards,
    getPurchases,
    getCreditCardByID,
    getPurchaseByID
};