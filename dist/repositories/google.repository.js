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
exports.GoogleRepository = void 0;
const tsyringe_1 = require("tsyringe");
let GoogleRepository = class GoogleRepository {
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
    async addUser(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`INSERT users SET ?`, [object]);
        const header = result;
        return header.affectedRows > 0 ? header.affectedRows : undefined;
    }
    async getUsers() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM users`);
        return result;
    }
    async getProductions() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM productions`);
        return result;
    }
    async addProduction(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`INSERT productions SET ?`, [object]);
        const header = result;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }
    async updateProduction(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`UPDATE productions SET ? WHERE production_id = ${object.production_id}`, [object]);
        const header = result;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }
    async addProductionAssignment(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`INSERT production_assignments SET ?`, [object]);
        const header = result;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }
    async getUserAssignments(user_id) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT 
            production_assignments.production_assignment_id, production_assignments.status AS assignment_status,
            productions.*
            FROM production_assignments 
            LEFT JOIN productions ON productions.production_id=production_assignments.production_id 
            WHERE production_assignments.user_id=${user_id}`);
        return result;
    }
    async updateProductionAssignment(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`UPDATE production_assignments SET ? WHERE production_assignment_id = ${object.production_assignment_id}`, [object]);
        const header = result;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }
    async updateUser(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`UPDATE users SET ? WHERE user_id = ${object.user_id}`, [object]);
        const header = result;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }
    async addHistoricalData(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`INSERT historical_data SET ?`, [object]);
        const header = result;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }
};
exports.GoogleRepository = GoogleRepository;
exports.GoogleRepository = GoogleRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('DbPool')),
    __metadata("design:paramtypes", [Object])
], GoogleRepository);
//# sourceMappingURL=google.repository.js.map