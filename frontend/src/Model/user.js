import { v4 as uuidv4 } from 'uuid';

export default class User {
    email = '';
    id = '';
    username = '';
    password = '';
    role = '';
    objectName = 'User';

    constructor(new_user) {
        if (!new_user) {
            return;
        }

        this.load(new_user);
    }

    load(new_user) {
        this.email = new_user.email;
        this.id = new_user.id || uuidv4();
        this.password = new_user.password || '';
        this.username = new_user.username;
        this.role = new_user.role;
    }

    isAdmin() {
        return this.role === 'admin';
    }

    isUser() {
        return this.role === 'user';
    }

    isManager() {
        return this.role === 'manager';
    }

    getId() {
        return this.id;
    }

    displayObjectId() {
        return this.id.length > 4 ? this.id.slice(0, 4) : this.id;
    }
}
