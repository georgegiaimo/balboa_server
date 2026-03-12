"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = __importDefault(require("crypto"));
class User {
    constructor(_id, _email, _password, _createdAt = new Date(), _updatedAt = new Date()) {
        this._id = _id;
        this._email = _email;
        this._password = _password;
        this._createdAt = _createdAt;
        this._updatedAt = _updatedAt;
    }
    static async create(data) {
        const id = User.generateId();
        const validatedEmail = User.validateEmail(data.email);
        const hashedPassword = await User.hashPassword(data.password);
        return new User(id, validatedEmail, hashedPassword);
    }
    static fromPersistence(data) {
        return new User(data.id, data.email, data.password, data.createdAt || new Date(), data.updatedAt || new Date());
    }
    async changeEmail(newEmail) {
        const validatedEmail = User.validateEmail(newEmail);
        this._email = validatedEmail;
        this._updatedAt = new Date();
    }
    async changePassword(newPassword) {
        User.validatePassword(newPassword);
        const hashedPassword = await User.hashPassword(newPassword);
        this._password = hashedPassword;
        this._updatedAt = new Date();
    }
    async verifyPassword(inputPassword) {
        return (0, bcryptjs_1.compare)(inputPassword, this._password);
    }
    static validateEmail(email) {
        if (!email || typeof email !== 'string') {
            throw new Error('Email is required');
        }
        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0) {
            throw new Error('Email cannot be empty');
        }
        if (trimmedEmail.length > 254) {
            throw new Error('Email is too long (max 254 characters)');
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmedEmail)) {
            throw new Error('Invalid email format');
        }
        return trimmedEmail.toLowerCase();
    }
    static validatePassword(password) {
        if (!password || typeof password !== 'string') {
            throw new Error('Password is required');
        }
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (password.length > 128) {
            throw new Error('Password is too long (max 128 characters)');
        }
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        if (!hasNumber || !hasLetter) {
            throw new Error('Password must contain at least one letter and one number');
        }
    }
    static async hashPassword(password) {
        User.validatePassword(password);
        return (0, bcryptjs_1.hash)(password, 12);
    }
    static generateId() {
        return crypto_1.default.randomUUID();
    }
    get id() {
        return this._id;
    }
    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    get createdAt() {
        return new Date(this._createdAt);
    }
    get updatedAt() {
        return new Date(this._updatedAt);
    }
    async updateProfile(data) {
        let hasChanges = false;
        if (data.email && data.email !== this._email) {
            await this.changeEmail(data.email);
            hasChanges = true;
        }
        if (data.password) {
            await this.changePassword(data.password);
            hasChanges = true;
        }
        if (hasChanges) {
            this._updatedAt = new Date();
        }
    }
    toPersistence() {
        return {
            id: this._id,
            email: this._email,
            password: this._password,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
    toResponse() {
        return {
            id: this._id,
            email: this._email,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
    equals(other) {
        return this._id === other._id;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map