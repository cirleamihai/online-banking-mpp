export default class CreditCard {
    objectId: string;
    cardTitle: string;
    cardType: string;
    cardNumber: string;
    cardPlaceHolder: string;
    expiryMo: number;
    expiryYr: number;
    cvv: string;

    constructor(card) {
        card ? this.objectId = card.id: this.objectId = '';
        card ? this.cardTitle = card.title : this.cardTitle = '';
        card ? this.cardType = card.type : this.cardType = '';
        card ? this.cardNumber = card.number : this.cardNumber = '';
        card ? this.cardPlaceHolder = card.placeHolder : this.cardPlaceHolder = '';
        card ? this.expiryMo = card.expiryMo : this.expiryMo = 0;
        card ? this.expiryYr = card.expiryYr : this.expiryYr = 0;
        card ? this.cvv = card.cvv : this.cvv = '';
    }

    stringifyExpirationDate() {
        let mo = this.expiryMo, yr = this.expiryYr;
        let mo_str = mo.toString();
        if (mo < 10) mo_str = `0${mo}`;
        return mo_str + '/' + yr.toString();
    }

    displayObjectId() {
        return this.objectId.length > 4 ? this.objectId.slice(0, 4) : this.objectId;
    }

    last4Digits() {
        return "**** " + this.cardNumber.slice(-4);
    }

    setExpirationDate(expirationDate) {
        let date = expirationDate.split('/');
        this.expiryMo = parseInt(date[0]);
        this.expiryYr = parseInt(date[1]);
    }

}