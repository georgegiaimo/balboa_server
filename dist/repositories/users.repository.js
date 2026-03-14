"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const tsyringe_1 = require("tsyringe");
const user_entity_1 = require("../entities/user.entity");
let UsersRepository = class UsersRepository {
    constructor(db) {
        this.db = db;
        this.users = [];
    }
    async findAll() {
        return this.users.map((userData) => user_entity_1.User.fromPersistence(userData));
    }
    async findById(user_id) {
        //const userData = this.users.find((u) => u.user_id === id);
        //return userData ? User.fromPersistence(userData) : undefined;
    }
    async findByEmail(email) {
        /*
        const userData = this.users.find((u) => u.email === email.toLowerCase());
        return userData ? User.fromPersistence(userData) : undefined;
        */
        const [result] = await this.db.query(`SELECT * FROM admins WHERE email='${email.toLowerCase()}'`);
        return result;
    }
    async save(object) {
        //const persistenceData = user.toPersistence();
        //this.users.push(persistenceData);
        const [result] = await this.db.query(`INSERT admins SET ?`, [object]);
        return result;
    }
    async updateUser(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`UPDATE admins SET ? WHERE admin_id = ${object.admin_id}`, [object]);
        return result;
    }
    async delete(id) {
        //const idx = this.users.findIndex((u) => u.user_id === id);
        //if (idx === -1) return false;
        //this.users.splice(idx, 1);
        return true;
    }
    async findByToken(token) {
        /*
        const userData = this.users.find((u) => u.email === email.toLowerCase());
        return userData ? User.fromPersistence(userData) : undefined;
        */
        const [result] = await this.db.query(`SELECT admin_id FROM admins WHERE password_reset_token='${token}'`);
        console.log(token, result);
        return result;
    }
    reset() {
        this.users = [];
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('DbPool')),
    __metadata("design:paramtypes", [Object])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map