const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
    id;
    username;
    email;
    passwordHash;

    constructor(user) {
        if (!user) {
            return;
        }
        this.id = user.id || uuidv4();
        this.username = user.username || '';
        this.email = user.email || '';
        this.passwordHash = user.passwordHash || '';
        this.role = user.role || 'user';
    }

    loadFromSQLDatabase(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.passwordHash = user.passwordHash;
        this.role = user.accessRole;
    }

    async updateContents(user) {
        if (user.username) {
            this.username = user.username;
        }
        if (user.email) {
            this.email = user.email;
        }
        if (user.role) {
            this.role = user.role;
        }
        if (user.password) {
            await this.setPassword(user.password);
        }
    }

    async setPassword(password) {
        this.passwordHash = ''
        this.passwordHash = await bcrypt.hash(password, 10);
    }

    async validatePassword(password) {
        return bcrypt.compare(password, this.passwordHash);
    }

    toAddSQLString() {
        return `'${this.id}', '${this.username}', '${this.passwordHash}', '${this.email}', '${this.role}'`;
    }

    toUpdateSQLString() {
        let initial_query = `username = '${this.username}', email = '${this.email}', accessRole = '${this.role}'`
        if (this.passwordHash) {
            initial_query += `, passwordHash = '${this.passwordHash}'`
        }

        return initial_query;
    }

    isTruthy() {
        return this.id && this.username && this.email && this.passwordHash;
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

module.exports = User;