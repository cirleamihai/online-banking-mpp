class repository {
    frontendCards = [];
    frontendPurchases = [];
    backendOnline = false;
    operationsQueue = [];

    constructor() {}

    addCard(card) {
        this.frontendCards = [...this.frontendCards, card];
    }

    addPurchase(purchase) {
        this.frontendPurchases = [...this.frontendPurchases, purchase];
    }

    updateCards(card) {
        this.frontendCards = this.frontendCards.map(c => {
            if (c.id === card.id) {
                return card;
            }
            return c;
        });
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
            this.frontendPurchases = this.frontendPurchases.filter(p => p.id !== object.id);
        } else if (object.objectName === 'Credit Card') {
            this.frontendCards = this.frontendCards.filter(c => c.id !== object.id);
        }
    }
}

export const repo = new repository();
