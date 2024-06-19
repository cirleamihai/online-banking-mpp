import {v4 as uuidv4} from 'uuid';

export default class CreditCard {
    id: string = '';
    title: string = '';
    type: string = '';
    number: string = '';
    placeHolder: string = '';
    expiryMo: number = 0;
    expiryYr: number = 0;
    cvv: string = '';
    objectName: string = 'Credit Card';
    usageNumber: number = 0;

    constructor(card) {
        if (!card) return;

        this.id = card.id || uuidv4();
        this.title = card.title || '';
        this.type = card.type || '';
        this.number = card.number || '';
        this.placeHolder = card.placeHolder || '';
        this.expiryMo = card.expiryMo || 0;
        this.expiryYr = card.expiryYr || 0;
        this.cvv = card.cvv || '';

        if (card.expiryDate) {
            this.setExpirationDate(card.expiryDate);
        }
    }

    expiryDate() {
        if (!this.expiryMo || !this.expiryYr) return '';
        let mo = this.expiryMo, yr = this.expiryYr;
        let mo_str = mo.toString();
        if (mo < 10) mo_str = `0${mo}`;
        return mo_str + yr.toString();
    }
    stringifyExpirationDate() {
        if (!this.expiryMo || !this.expiryYr) return '00/00';
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
        return this.number && this.expiryMo && this.expiryYr && this.cvv && this.type && this.placeHolder;
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

    isEqual(anotherCard) {
        return this.id === anotherCard.id && this.title === anotherCard.title && this.type === anotherCard.type &&
            this.number === anotherCard.number && this.placeHolder === anotherCard.placeHolder &&
            this.expiryMo === anotherCard.expiryMo && this.expiryYr === anotherCard.expiryYr && this.cvv === anotherCard.cvv;
    }

}