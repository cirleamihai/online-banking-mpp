import {v4 as uuidv4} from 'uuid';

class Purchase {
    id: string;
    totalValue: number;
    merchant: string;
    cardID: string;
    cardNumber: string;
    objectName: string = 'Purchase';

    constructor(purchases) {
        if (!purchases) {
            return;
        }

        purchases.id ? this.id = purchases.id : this.id = uuidv4();
        purchases.totalValue ? this.totalValue = purchases.totalValue : this.totalValue = 0;
        purchases.merchant ? this.merchant = purchases.merchant : this.merchant = '';
        purchases.cardID ? this.cardID = purchases.cardID : this.cardID = '';
        purchases.cardNumber ? this.cardNumber = purchases.cardNumber : this.cardNumber = '';
    }

    displayObjectId() {
        return this.id.length > 4 ? this.id.slice(0, 4) : this.id;
    }

    cardLast4Digits() {
        return "**** " + this.cardNumber.slice(-4);
    }

    isTruthy() {
        return this.id;
    }

    isEqual(purchase) {
        return this.id === purchase.id && this.totalValue === purchase.totalValue &&
            this.merchant === purchase.merchant && this.cardID === purchase.cardID &&
            this.cardNumber === purchase.cardNumber;
    }

}

export default Purchase;