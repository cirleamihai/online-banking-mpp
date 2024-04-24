class repository {
    frontendCards = [];
    frontendPurchases = [];
    backendOnline = false;
    operationsQueue = [];

    constructor() {}

    addCard(card) {
        this.frontendCards.push(card);
    }

    addPurchase(purchase) {
        this.frontendPurchases.push(purchase);
    }

    updateCards(card) {
        const index = this.frontendCards.findIndex(c => c.id === card.id);
        this.frontendCards[index] = card;
    }

    updatePurchase(purchase) {
        const index = this.frontendPurchases.findIndex(p => p.id === purchase.id);
        this.frontendPurchases[index] = purchase;
    }

    serverOnline() {
        this.backendOnline = true;
    }

    serverOffline() {
        this.backendOnline = false;
    }

    isServerOnline() {
        return this.backendOnline;
    }

    getCards() {
        return this.frontendCards;
    }

    getPurchases() {
        return this.frontendPurchases;
    }

    addOperation(operation, fctArgs) {
        this.operationsQueue.push([operation, fctArgs]);
    }

    executeOperations() {
        for (let i = 0; i < this.operationsQueue.length; i++) {
            const operation = this.operationsQueue[i][0];
            const fctArgs = this.operationsQueue[i][1];
            operation(...fctArgs);
        }

        this.operationsQueue = [];
        return this;
    }

    setObject(objectName, objects) {
        if (objectName === 'cards') {
            this.frontendCards = objects;
        } else if (objectName === 'purchases') {
            this.frontendPurchases = objects;
        }
    }

    getObject(objectName: string) {
        if (objectName === 'cards') {
            return this.frontendCards;
        } else if (objectName === 'purchases') {
            return this.frontendPurchases;
        }
    }

    getObjectbyObject(object) {
        if (object.objectName === 'Purchase') {
            return this.frontendPurchases;
        } else if (object.objectName === 'Credit Card') {
            return this.frontendCards;
        }
    }

    deleteObject(object) {
        if (object.objectName === 'Purchase') {
            const index = this.frontendPurchases.findIndex(p => p.id === object.id);
            this.frontendPurchases.splice(index, 1);
        } else if (object.objectName === 'Credit Card') {
            const index = this.frontendCards.findIndex(c => c.id === object.id);
            this.frontendCards.splice(index, 1);
        }
    }
}

export const repo = new repository();
