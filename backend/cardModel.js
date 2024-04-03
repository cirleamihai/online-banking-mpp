class CreditCard {
    id;
    title;
    type;
    number;
    placeHolder;
    expiryMo;
    expiryYr;
    cvv;

    constructor(card) {
        card.id ? this.id = card.id: this.id = '';
        card.title ? this.title = card.title : this.title = '';
        card.type ? this.type = card.type : this.type = '';
        card.number ? this.number = card.number : this.number = '';
        card.placeHolder ? this.placeHolder = card.placeHolder : this.placeHolder = '';
        card.expiryMo ? this.expiryMo = card.expiryMo : this.expiryMo = 0;
        card.expiryYr ? this.expiryYr = card.expiryYr : this.expiryYr = 0;
        card.cvv ? this.cvv = card.cvv : this.cvv = '';
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

}

module.exports = CreditCard;