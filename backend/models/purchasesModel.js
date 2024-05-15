const {v4: uuidv4} = require('uuid');

class Purchase {
    id;
    totalValue;
    merchant;
    cardID;
    cardNumber;
    userId;

    constructor(purchases) {
        if (!purchases) {
            return;
        }

        this.id = purchases.id || uuidv4();
        this.totalValue = purchases.totalValue || 0;
        this.merchant = purchases.merchant || '';
        this.cardID = purchases.cardID || '';
        this.cardNumber = purchases.cardNumber || '';
        this.userId = purchases.userId || '';
    }

    loadFromSQLDatabase(purchases) {
        this.id = purchases.id;
        this.totalValue = purchases.totalValue;
        this.merchant = purchases.merchant;
        this.cardID = purchases.cardID;
        this.cardNumber = purchases.cardNumber;
        this.userId = purchases.userId || '';
    }

    toAddSQLString() {
        // return an SQL string to insert the object into the database
        return "'" + this.id + "', " + this.totalValue + ", '" + this.merchant + "', '" + this.cardID + "'";
    }

    toUpdateSQLString() {
        // return an SQL string to update the object in the database
        return "totalValue = " + this.totalValue + ", merchant = '" + this.merchant + "', cardID = '" + this.cardID + "'";
    }

    isTruthy() {
        return this.id && this.totalValue && this.merchant;
    }
}

module.exports = Purchase;