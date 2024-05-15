export default class User {
    email = '';
    id = '';
    username = '';

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
    }
}
