const database = require("../database/databaseHandler");
const CreditCard = require("../models/cardModel");
const Purchase = require("../models/purchasesModel");

let creditCards = [];
let purchases = [];

async function loadData() {
    const creditCardsDB = await database.fetchData();
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

module.exports = {
    loadData,
    getCreditCards,
    getPurchases
};