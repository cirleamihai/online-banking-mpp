class Purchase {
    id;
    totalValue;
    merchant;
    cardID;

    constructor(purchases) {
        if (!purchases) {
            return;
        }

        purchases.id ? this.id = purchases.id : this.id = '';
        purchases.totalValue ? this.totalValue = purchases.totalValue : this.totalValue = 0;
        purchases.merchant ? this.merchant = purchases.merchant : this.merchant = '';
        purchases.cardID ? this.cardID = purchases.cardID : this.cardID = '';
    }

    loadFromSQLDatabase(purchases) {
        this.id = purchases.id;
        this.totalValue = purchases.totalValue;
        this.merchant = purchases.merchant;
        this.cardID = purchases.cardID;
    }

    toAddSQLString() {
        // return an SQL string to insert the object into the database
        return "'" + this.id + "', " + this.totalValue + ", '" + this.merchant + "', '" + this.cardID + "'";
    }

    toUpdateSQLString() {
        // return an SQL string to update the object in the database
        return "totalValue = " + this.totalValue + ", merchant = '" + this.merchant + "', cardID = '" + this.cardID + "'";
    }
}

module.exports = Purchase;