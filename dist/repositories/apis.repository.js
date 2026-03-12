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
exports.ApisRepository = void 0;
const tsyringe_1 = require("tsyringe");
let ApisRepository = class ApisRepository {
    // We "Inject" the pool that was created elsewhere
    constructor(db) {
        this.db = db;
    }
    async getProductions() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM productions`);
        return result;
    }
    async getProductionAssignments() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM production_assignments`);
        return result;
    }
    async getProductionDetails(production_id) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM productions WHERE production_id=${production_id}`);
        return result;
    }
    async getCoordinators() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM coordinators`);
        return result;
    }
    async getCoordinatorAssignments() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM coordinator_assignments`);
        return result;
    }
    async getProductionCoordinators(production_id) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT coordinator_assignments.status AS coordinator_assignment_status,
            coordinators.* 
            FROM coordinator_assignments 
            LEFT JOIN coordinators ON coordinators.coordinator_id=coordinator_assignments.coordinator_id 
            WHERE coordinator_assignments.production_id=${production_id}`);
        return result;
    }
    async getProductionUsers(production_id) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT production_assignments.status AS assignment_status,
            users.* 
            FROM production_assignments 
            LEFT JOIN users ON users.user_id=production_assignments.user_id 
            WHERE production_assignments.production_id=${production_id}`);
        return result;
    }
    async getUserDetails(user_id) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM users WHERE user_id=${user_id}`);
        return result;
    }
    async getUserAssignments(user_id) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT 
            production_assignments.status AS assignment_status,
            productions.*
            FROM production_assignments 
            LEFT JOIN productions ON productions.production_id=production_assignments.production_id 
            WHERE production_assignments.user_id=${user_id}`);
        return result;
    }
    async getUsers() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT * FROM users`);
        return result;
    }
    async getAdmins() {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT admin_id, first_name, last_name, email, role, created_timestamp, last_login FROM admins`);
        return result;
    }
    async getAdmin(admin_id) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`SELECT admin_id, first_name, last_name, email, role FROM admins WHERE admin_id=${admin_id}`);
        return result;
    }
    async addAdmin(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`INSERT admins SET ?`, [object]);
        return result;
    }
    async updateAdmin(object) {
        //const data = user.toPersistence();
        const [result] = await this.db.query(`UPDATE admins SET ? WHERE user_id = ${object.user_id}`, [object]);
        return result;
    }
};
exports.ApisRepository = ApisRepository;
exports.ApisRepository = ApisRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('DbPool')),
    __metadata("design:paramtypes", [Object])
], ApisRepository);
//# sourceMappingURL=apis.repository.js.map