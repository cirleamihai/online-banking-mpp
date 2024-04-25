const database = require("../database/databaseHandler");
const CreditCard = require("../models/cardModel");
const Purchase = require("../models/purchasesModel");

async function loadData(offset, limit) {
    const creditCardsDB = await database.fetchData('CardsWithUsage', offset, limit);
    const purchasesDB = await database.fetchData('purchasesCardNumberView', offset, limit);

    const creditCards = creditCardsDB.map((card) => {
        const localCC = new CreditCard();
        localCC.loadFromSQLDatabase(card);
        return localCC
    });
    const purchases = purchasesDB.map((purchase) => {
        const localPurchase = new Purchase();
        localPurchase.loadFromSQLDatabase(purchase);
        return localPurchase;
    });

    return [creditCards, purchases];
}

async function getCreditCards(offset, limit) {
    return (await loadData(offset, limit))[0];
}

async function getPurchases(offset, limit) {
    return (await loadData(offset, limit))[1];
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