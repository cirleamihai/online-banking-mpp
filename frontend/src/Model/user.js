export default class User {
    email = '';
    id = '';
    username = '';
    role = '';

    constructor(new_user) {
        if (!new_user) {
            return;
        }

        this.load(new_user);
    }

    load(new_user) {
        this.email = new_user.email;
        this.id = new_user.id;
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
}
