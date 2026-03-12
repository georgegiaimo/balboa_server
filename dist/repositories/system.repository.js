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
exports.SystemRepository = void 0;
const tsyringe_1 = require("tsyringe");
let SystemRepository = class SystemRepository {
    // We "Inject" the pool that was created elsewhere
    constructor(db) {
        this.db = db;
    }
    async getConfiguration() {
        const [rows] = await this.db.query('SELECT * FROM ai_configuration');
        return rows;
    }
    async updateConfiguration(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`UPDATE ai_configuration SET ? WHERE id = ${object.id}`, [object, object.id]);
        const header = result;
        return header.affectedRows > 0 ? header.affectedRows : undefined;
    }
};
exports.SystemRepository = SystemRepository;
exports.SystemRepository = SystemRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('DbPool')),
    __metadata("design:paramtypes", [Object])
], SystemRepository);
//# sourceMappingURL=system.repository.js.map