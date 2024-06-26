import User from '../Model/user.js';

class repository {
    frontendCards = [];
    frontendPurchases = [];
    frontendUsers = [];
    backendOnline = false;
    operationsQueue = [];
    changes = 0;
    totalPages = 0;
    loginToken = '';
    user = new User();


    constructor() {
        this.loadToken();
        this.loadUser();
    }

    synchronize() {
        // If we changed something, we don't want to synchronize with the database since the database
        // might need to perform some operations on the data that we already did.
        if (this.changes > 0) {
            this.changes = 0;
            return false;
        }

        return true;
    }

    loadToken() {
        this.loginToken = localStorage.getItem('token');
    }

    loadUser() {
        const user = localStorage.getItem('user');
        if (user) {
            this.user = new User(JSON.parse(user));
        }
    }

    setToken(token) {
        localStorage.setItem('token', token);
        this.loginToken = token;
    }

    setUser(user) {
        this.user = new User(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser() {
        return this.user;
    }

    getUserId() {
        return this.user.getId();
    }

    getCrudPerms() {
        return !this.user.isUser();
    }

    getAdminAccess() {
        return this.user.isAdmin();
    }

    getToken() {
        return this.loginToken;
    }

    clearToken() {
        this.loginToken = '';
        localStorage.removeItem('token');
    }

    clearUser() {
        this.user = new User();
        localStorage.removeItem('user');
    }

    clearLocalStorage() {
        this.clearToken();
        this.clearUser();
        this.frontendCards = [];
        this.frontendPurchases = [];
    }

    addCard(card) {
        this.frontendCards = [...this.frontendCards, card];
        this.changes++;
    }

    addPurchase(purchase) {
        this.frontendPurchases = [...this.frontendPurchases, purchase];
        this.changes++;
    }

    addUser(user) {
        this.frontendUsers = [...this.frontendUsers, user];
        this.changes++;
    }

    updateUser(user) {
        this.frontendUsers = this.frontendUsers.map(u => {
            if (u.id === user.id) {
                return user;
            }
            return u;
        });
        this.changes++;
    }

    updateCard(card) {
        this.frontendCards = this.frontendCards.map(c => {
            if (c.id === card.id) {
                return card;
            }
            return c;
        });
        this.changes++;
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

    getUserById(id) {
        return this.frontendUsers.find(u => u.id === id);
    }

    getCardById(id) {
        return this.frontendCards.find(c => c.id === id);
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

    compareObjects(objectName, objects, currentPage) {
        // trying to see if there are new objects, append them to the frontend objects
        // otherwise, update the existing ones
        if (currentPage > this.totalPages) {
            this.addObject(objectName, objects);
            this.totalPages++;
            console.log('Total pages: ', this.totalPages);
        } else {
            this.setObject(objectName, objects);
        }
    }

    addObject(objectName, objects) {
        if (objectName === 'cards') {
            this.frontendCards = [...this.frontendCards, ...objects];
        } else if (objectName === 'purchases') {
            this.frontendPurchases = [...this.frontendPurchases, ...objects];
        } else if (objectName === 'users') {
            this.frontendUsers = [...this.frontendUsers, ...objects];
        }
    }

    setObject(objectName, objects) {
        let feObjects;
        if (objectName === 'cards') {
            feObjects = this.frontendCards;
        } else if (objectName === 'purchases') {
            feObjects = this.frontendPurchases;
        } else if (objectName === 'users') {
            feObjects = this.frontendUsers;
        }

        for (const object of objects) {
            const index = feObjects.findIndex(o => o.id === object.id);
            if (index === -1) {
                feObjects.push(object);
            } else {
                feObjects[index] = object;
            }
        }

        if (objectName === 'cards') {
            this.frontendCards = [...feObjects];
        } else if (objectName === 'purchases') {
            this.frontendPurchases = [...feObjects];
        } else if (objectName === 'users') {
            this.frontendUsers = [...feObjects];
        }
    };

    getObject(objectName: string) {
        if (objectName === 'cards') {
            return this.frontendCards;
        } else if (objectName === 'purchases') {
            return this.frontendPurchases;
        } else if (objectName === 'users') {
            return this.frontendUsers;
        }
    }

    getObjectByObject(object) {
        if (object.objectName === 'Purchase') {
            return this.frontendPurchases;
        } else if (object.objectName === 'Credit Card') {
            return this.frontendCards;
        } else if (object.objectName === 'User') {
            return this.frontendUsers;
        }
    }

    deleteObject(object) {
        if (object.objectName === 'Purchase') {
            this.frontendPurchases = this.frontendPurchases.filter(p => p.id !== object.id);
            this.frontendCards = this.frontendCards.map(card => {
                if (card.id === object.cardID) {
                    card.usageNumber--;
                }
                return card;
            })
        } else if (object.objectName === 'Credit Card') {
            this.frontendCards = this.frontendCards.filter(c => c.id !== object.id);
            this.frontendPurchases = this.frontendPurchases.filter(p => p.cardID !== object.id);
        } else if (object.objectName === 'User') {
            this.frontendUsers = this.frontendUsers.filter(u => u.id !== object.id);
            // normally we would have to also delete the purchases and cards of the user,
            // but we get the user's purchases and cards from the server once we log in,
            // so we don't have to do anything

        }
        this.changes++;
    }
}

export const repo = new repository();
