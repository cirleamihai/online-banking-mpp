const {v4: uuidv4} = require('uuid');

class CreditCard {
    id;
    title;
    type;
    number;
    placeHolder;
    expiryMo;
    expiryYr;
    cvv;
    usageNumber;
    userId;

    constructor(card) {
        if (!card) {
            return;
        }

        this.id = card.id || uuidv4();
        this.title = card.title || '';
        this.type = card.type || '';
        this.number = card.number || '';
        this.placeHolder = card.placeHolder || '';
        this.expiryMo = card.expiryMo || 0;
        this.expiryYr = card.expiryYr || 0;
        this.cvv = card.cvv || '';
        this.usageNumber = card.UsageCount || 0;
        this.userId = card.userId || '';
    }

    loadFromSQLDatabase(card) {
        this.id = card.id;
        this.title = card.title;
        this.type = card.cardType;
        this.number = card.cardNumber;
        this.placeHolder = card.placeHolder;
        this.expiryMo = card.expiryMo;
        this.expiryYr = card.expiryYr;
        this.cvv = card.cvv;
        this.usageNumber = card.UsageCount;
        this.userId = card.userId || '';
    }

    stringifyExpirationDate() {
        let mo = this.expiryMo, yr = this.expiryYr;
        let mo_str = mo.toString();
        if (mo < 10) mo_str = `0${mo}`;
        return mo_str + '/' + yr.toString();
    }

    displayObjectId() {
        return this.id.length > 4 ? this.id.slice(0, 4) : this.id;
    }

    last4Digits() {
        return "**** " + this.number.slice(-4);
    }

    setExpirationDate(expirationDate) {
        let date = expirationDate.split('/');
        this.expiryMo = parseInt(date[0]);
        this.expiryYr = parseInt(date[1]);
    }

    toAddSQLString() {
        // return an SQL string to insert the object into the database
        return "'" + this.id + "', '" + this.title + "', '" + this.type + "', '" + this.placeHolder +
            "', '" + this.number + "', " + this.expiryMo + ", " + this.expiryYr + ", '" + this.cvv +
            "'" + ", '" + this.userId + "'";
    }

    toUpdateSQLString() {
        return "title = '" + this.title + "', cardType = '" + this.type + "', placeHolder = '" + this.placeHolder +
            "', cardNumber = '" + this.number + "', expiryMo = " + this.expiryMo + ", expiryYr = " + this.expiryYr + ", cvv = '" + this.cvv + "'";
    }

    isTruthy() {
        return this.id && this.number && this.expiryMo && this.expiryYr && this.cvv;
    }
}

module.exports = CreditCard;