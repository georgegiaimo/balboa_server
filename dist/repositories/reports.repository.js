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
exports.ReportsRepository = void 0;
const tsyringe_1 = require("tsyringe");
let ReportsRepository = class ReportsRepository {
    // We "Inject" the pool that was created elsewhere
    constructor(db) {
        this.db = db;
    }
    /*
    async getConfiguration(): Promise<RowDataPacket[]> {

        const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM ai_configuration');
        return rows;
    }
    */
    async getUsers() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM users`);
        return result;
    }
    async getProductionAssignments() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM production_assignments`);
        return result;
    }
    async getProductions() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM productions`);
        return result;
    }
    async getHistoricalData() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM historical_data`);
        return result;
    }
};
exports.ReportsRepository = ReportsRepository;
exports.ReportsRepository = ReportsRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('DbPool')),
    __metadata("design:paramtypes", [Object])
], ReportsRepository);
//# sourceMappingURL=reports.repository.js.map