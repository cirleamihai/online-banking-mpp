class Purchase {
    id: string;
    totalValue: number;
    merchant: string;
    cardID: string;
    objectName: string = 'Purchase';

    constructor(purchases) {
        if (!purchases) {
            return;
        }

        purchases.id ? this.id = purchases.id : this.id = '';
        purchases.totalValue ? this.totalValue = purchases.totalValue : this.totalValue = 0;
        purchases.merchant ? this.merchant = purchases.merchant : this.merchant = '';
        purchases.cardID ? this.cardID = purchases.cardID : this.cardID = '';
    }

    isTruthy() {
        return this.id;
    }

}

export default Purchase;