const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
    constructor(user) {
        if (!user) {
            return;
        }
        this.id = user.id || uuidv4();
        this.username = user.username || '';
        this.email = user.email || '';
        this.passwordHash = user.passwordHash || '';
    }

    loadFromSQLDatabase(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.passwordHash = user.passwordHash;
    }

    async setPassword(password) {
        this.passwordHash = await bcrypt.hash(password, 10);
    }

    async validatePassword(password) {
        return bcrypt.compare(password, this.passwordHash);
    }

    toAddSQLString() {
        return `'${this.id}', '${this.username}', '${this.passwordHash}', '${this.email}'`;
    }

    isTruthy() {
        return this.id && this.username && this.email && this.passwordHash;
    }
}

module.exports = User;