const { v4: uuidv4 } = require('uuid');

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

    constructor(card) {
        if (!card) {
            return;
        }

        card.id ? this.id = card.id: this.id = uuidv4();
        card.title ? this.title = card.title : this.title = '';
        card.type ? this.type = card.type : this.type = '';
        card.number ? this.number = card.number : this.number = '';
        card.placeHolder ? this.placeHolder = card.placeHolder : this.placeHolder = '';
        card.expiryMo ? this.expiryMo = card.expiryMo : this.expiryMo = 0;
        card.expiryYr ? this.expiryYr = card.expiryYr : this.expiryYr = 0;
        card.cvv ? this.cvv = card.cvv : this.cvv = '';
        card.usageNumber ? this.usageNumber = card.usageNumber : this.usageNumber = 0;
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
            "', '" + this.number + "', " + this.expiryMo + ", " + this.expiryYr + ", '" + this.cvv + "'";
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