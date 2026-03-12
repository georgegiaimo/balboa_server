"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const tsyringe_1 = require("tsyringe");
const user_entity_1 = require("../entities/user.entity");
let UsersRepository = class UsersRepository {
    constructor() {
        this.users = [];
    }
    async findAll() {
        return this.users.map((userData) => user_entity_1.User.fromPersistence(userData));
    }
    async findById(id) {
        const userData = this.users.find((u) => u.id === id);
        return userData ? user_entity_1.User.fromPersistence(userData) : undefined;
    }
    async findByEmail(email) {
        const userData = this.users.find((u) => u.email === email.toLowerCase());
        return userData ? user_entity_1.User.fromPersistence(userData) : undefined;
    }
    async save(user) {
        const persistenceData = user.toPersistence();
        this.users.push(persistenceData);
        return user;
    }
    async update(id, user) {
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx === -1)
            return undefined;
        this.users[idx] = user.toPersistence();
        return user;
    }
    async delete(id) {
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx === -1)
            return false;
        this.users.splice(idx, 1);
        return true;
    }
    reset() {
        this.users = [];
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, tsyringe_1.singleton)()
], UsersRepository);
//# sourceMappingURL=users.repository.js.map