import {v4 as uuidv4} from 'uuid';

export default class CreditCard {
    id: string;
    title: string;
    type: string;
    number: string;
    placeHolder: string;
    expiryMo: number;
    expiryYr: number;
    cvv: string;
    objectName: string = 'Credit Card';
    usageNumber: number = 0;

    constructor(card) {
        card ? this.id = card.id : this.id = uuidv4();
        card ? this.title = card.title : this.title = '';
        card ? this.type = card.type : this.type = '';
        card ? this.number = card.number : this.number = '';
        card ? this.placeHolder = card.placeHolder : this.placeHolder = '';
        card ? this.expiryMo = card.expiryMo : this.expiryMo = 0;
        card ? this.expiryYr = card.expiryYr : this.expiryYr = 0;
        card ? this.cvv = card.cvv : this.cvv = '';
        card ? this.usageNumber = card.usageNumber : this.usageNumber = 0;
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

    isTruthy() {
        return this.number && this.expiryMo && this.expiryYr && this.cvv;
    }

    purchaseOptionDisplayer() {
        return this.placeHolder + " | " + this.last4Digits();
    }

    checkUsageNumber(purchases) {
        this.usageNumber = 0;

        for (let purchase of purchases) {
            if (purchase.cardID === this.id) {
                this.usageNumber++;
            }
        }
    }

}