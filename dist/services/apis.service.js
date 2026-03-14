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
exports.ApisService = void 0;
const tsyringe_1 = require("tsyringe");
const apis_repository_1 = require("../repositories/apis.repository");
const common_service_1 = require("./common.service");
const sendgrid_service_1 = require("./sendgrid.service");
let ApisService = class ApisService {
    constructor(apisRepository, commonService, sendgridService) {
        this.apisRepository = apisRepository;
        this.commonService = commonService;
        this.sendgridService = sendgridService;
    }
    async getProductions() {
        var assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        var coordinators = await this.apisRepository.getCoordinators();
        var coordinator_assignments = await this.apisRepository.getCoordinatorAssignments();
        //console.log('productions.length', productions.length);
        //console.log('assignments.length', assignments.length);
        //get how many assignments for each production
        productions.forEach((production) => {
            //get active assignments
            var production_assignments = assignments.filter((x) => {
                return ((x.production_id == production.production_id) && x.status == 'active');
            });
            production.active_users = production_assignments.length;
            var coordinators_ids = coordinator_assignments.filter((x) => { return x.production_id == production.production_id; }).map((x) => { return x.coordinator_id; });
            var production_coordinators = coordinators.filter((x) => {
                return coordinators_ids.indexOf(x.coordinator_id) > -1;
            });
            production.coordinators = production_coordinators;
        });
        //filter productions with 0 active users
        //productions = productions.filter((x:any) => { return x.active_users > 0});
        productions = productions.sort((a, b) => { return b.active_users - a.active_users; });
        return productions;
    }
    async getProductionDetails(production_id) {
        var productionx = await this.apisRepository.getProductionDetails(production_id);
        var production = productionx[0];
        var coordinators = await this.apisRepository.getProductionCoordinators(production_id);
        var users = await this.apisRepository.getProductionUsers(production_id);
        //check assignments for each user
        users.forEach((x) => {
            x.last_login_date = this.commonService.getDate(x.last_login_time);
        });
        return {
            production: production,
            users: users,
            coordinators: coordinators
        };
    }
    async getUserDetails(user_id) {
        var userx = await this.apisRepository.getUserDetails(user_id);
        var user = userx[0];
        var assignments = await this.apisRepository.getUserAssignments(user_id);
        assignments.forEach((x) => {
            //get start and end dates
            x.assignment_start_date = this.commonService.getDate(x.created_timestamp);
            x.assignment_end_date = this.commonService.getDate(x.ended_timestamp);
        });
        user.last_login_date = this.commonService.getDate(user.last_login_time);
        return {
            user: user,
            assignments: assignments
        };
    }
    async getUsers() {
        var users = await this.apisRepository.getUsers();
        var assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        //check assignments for each user
        users.forEach((user) => {
            var assignmentsx = assignments.filter((x) => { return x.user_id == user.user_id; });
            var productionsx = [];
            assignmentsx.forEach((n) => {
                var production = productions.find((m) => { return m.production_id == n.production_id; });
                production.assignment_status = n.status;
                //get start and end dates
                production.assignment_start_date = this.commonService.getDate(n.created_timestamp);
                production.assignment_end_date = this.commonService.getDate(n.ended_timestamp);
                productionsx.push(production);
            });
            user.productions = productionsx;
            user.last_login_date = this.commonService.getDate(user.last_login_time);
        });
        //console.log('users', users);
        return users;
    }
    async getDomainDetails(domain) {
        var productionsx = await this.apisRepository.getProductions();
        var assignments = await this.apisRepository.getProductionAssignments();
        var usersx = await this.apisRepository.getUsers();
        var users = usersx.filter((x) => { return x.production_email.indexOf(domain) > -1; });
        var users_ids = users.map((x) => { return x.user_id; });
        var productions = [];
        assignments.forEach((x) => {
            var is_domain_user = users_ids.indexOf(x.user_id) > -1;
            if (is_domain_user) {
                //find production
                var production = productionsx.find((m) => { return m.production_id == x.production_id; });
                //see if production is already in array
                var record = productions.find((m) => { return m.name == production.name; });
                if (record) {
                    record.users += 1;
                }
                else {
                    production.users = 1;
                    productions.push(production);
                }
            }
        });
        return {
            users: users,
            productions: productions
        };
    }
    async getAdmins() {
        var admins = await this.apisRepository.getAdmins();
        admins.forEach((x) => {
            x.created_date = this.commonService.getDate(x.created_timestamp);
            x.last_login_date = this.commonService.getDate(x.last_login);
        });
        return admins;
    }
    /*
    public async addAdmin(first_name:string, last_name:string, email:string, role:string){
        
        //check that email is not already used
        var admins = await this.apisRepository.getAdminByEmail(email);
        if (admins.length > 0) return -1;
        
        var object = {
            first_name,
            last_name,
            email,
            role,
            created_timestamp: Date.now()
        }


        var admin_id = await this.apisRepository.addAdmin(object);
        
        await this.sendgridService.notificationOfAdminInvitation(object);
        
        return admin_id;
    }
    */
    async getAdmin(admin_id) {
        var admins = await this.apisRepository.getAdmin(admin_id);
        admins.forEach((x) => {
            x.created_date = this.commonService.getDate(x.created_timestamp);
            x.last_login_date = this.commonService.getDate(x.last_login);
        });
        return admins;
    }
    async updateAdmin(object) {
        var admin_id = await this.apisRepository.updateAdmin(object);
        return admin_id;
    }
    async getCoordinators() {
        var coordinators = await this.apisRepository.getCoordinators();
        var coordinator_assignments = await this.apisRepository.getCoordinatorAssignments();
        var productions = await this.apisRepository.getProductions();
        coordinators.forEach((x) => {
            var assignments = coordinator_assignments.filter((n) => { return n.coordinator_id == x.coordinator_id; });
            var production_ids = assignments.map((n) => { return n.production_id; });
            var productionsx = productions.filter((n) => { return production_ids.indexOf(n.production_id) > -1; });
            if (productionsx[0])
                x.production = productionsx[0].name;
        });
        return coordinators;
    }
    async getCoordinatorDetails(coordinator_id) {
        var coordinatorx = await this.apisRepository.getCoordinator(coordinator_id);
        var coordinator = coordinatorx[0];
        var assignments = await this.apisRepository.getAssignmentsByCoordinatorId(coordinator_id);
        assignments.forEach((x) => {
            //get start and end dates
            x.assignment_start_date = this.commonService.getDate(x.created_timestamp);
            x.assignment_end_date = this.commonService.getDate(x.ended_timestamp);
        });
        return {
            coordinator: coordinator,
            assignments: assignments
        };
    }
};
exports.ApisService = ApisService;
exports.ApisService = ApisService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(apis_repository_1.ApisRepository)),
    __param(1, (0, tsyringe_1.inject)(common_service_1.CommonService)),
    __param(2, (0, tsyringe_1.inject)(sendgrid_service_1.SendGridService)),
    __metadata("design:paramtypes", [Object, common_service_1.CommonService,
        sendgrid_service_1.SendGridService])
], ApisService);
//# sourceMappingURL=apis.service.js.map