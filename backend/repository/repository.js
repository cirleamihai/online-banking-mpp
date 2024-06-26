const database = require("../database/databaseHandler");
const CreditCard = require("../models/cardModel");
const Purchase = require("../models/purchasesModel");
const User = require("../models/userModel");

async function getUserCreditCards(userId, offset, limit) {
    const creditCardsDB =  await database.fetchUserData('getUserCards', userId, offset, limit);

    return creditCardsDB.map((card) => {
        const localCC = new CreditCard();
        localCC.loadFromSQLDatabase(card);
        return localCC
    });
}

async function getUserPurchases(userId, offset, limit) {
    const purchasesDB = await database.fetchUserData('getUserPurchases', userId, offset, limit);
    return purchasesDB.map((purchase) => {
        const localPurchase = new Purchase();
        localPurchase.loadFromSQLDatabase(purchase);
        return localPurchase;
    });
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

function getPurchaseByID(purchaseId, userId) {
    return database.getObjectByID('userPurchasesView', purchaseId, 'id', userId).then((purchase) => {
        const localPurchase = new Purchase();
        if (purchase[0]) {
            localPurchase.loadFromSQLDatabase(purchase[0]);
        }
        return localPurchase;
    });
}

function getUserByEmail(email) {
    return database.getObjectByID('users', email, `username = '${email}' or email`).then((user) => {
        const localUser = new User();
        if (user[0]) {
            localUser.loadFromSQLDatabase(user[0]);
        }
        return localUser;
    });
}

function getUserByID(userID) {
    return database.getObjectByID('users', userID).then((user) => {
        const localUser = new User();
        if (user[0]) {
            localUser.loadFromSQLDatabase(user[0]);
        }
        return localUser;
    });
}

function getUsers() {
    // works only if the accessID is a valid admin ID
    return database.executeProcedure('getUsers').then((users) => {
        if (!users) {
            return []
        }

        return users.map((user) => {
            const localUser = new User();
            localUser.loadFromSQLDatabase(user);
            return localUser;
        });
    });
}
getUsers();

function checkAdmin(adminID) {
    return database.fetchUserData('checkUserAdmin', adminID).then((result) => {
        return result ? true : false;
    });
}

module.exports = {
    getUserCreditCards,
    getUserPurchases,
    getCreditCardByID,
    getPurchaseByID,
    getUserByEmail,
    getUsers,
    getUserByID,
    checkAdmin
};