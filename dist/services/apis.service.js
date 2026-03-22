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
        var activity = await this.apisRepository.getProductionActivity(production_id);
        //format date
        users.forEach((x) => {
            x.last_login_date = this.commonService.getDate(x.last_login_time);
        });
        //remove user duplicates
        const uniqueUsers = [...new Map(users.map((user) => [user.user_id, user])).values()];
        activity.forEach((x) => {
            x.date = this.commonService.getDate(x.timestamp);
        });
        return {
            production: production,
            users: uniqueUsers,
            coordinators: coordinators,
            activity: activity
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
            assignments.forEach((n) => {
                var record = productions.find((m) => { return m.production_id == n.production_id; });
                if (record)
                    n.production_name = record.name;
            });
            x.assignments = assignments;
            if (x.assignments.length == 0)
                x.status = 'unassigned';
            else {
                //check if there s an active assignment
                var recordx = assignments.find((n) => { return n.status == 'active'; });
                if (recordx)
                    x.status = 'active';
                else
                    x.status = 'unknown';
            }
        });
        return coordinators;
    }
    async addCoordinator(data) {
        var coordinator = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            created_timestamp: Date.now(),
            notes: data.notes
        };
        var coordinator_id = this.apisRepository.addCoordinator(coordinator);
        return coordinator_id;
    }
    async addCoordinatorAssignment(data) {
        var coordinator_assignment = {
            coordinator_id: data.coordinator_id,
            production_id: data.production_id,
            notes: data.notes,
            created_timestamp: Date.now(),
            created_by_admin_id: data.admin_id,
            status: data.status
        };
        var coordinator_assignment_id = this.apisRepository.addCoordinatorAssignment(coordinator_assignment);
        return coordinator_assignment_id;
    }
    async updateCoordinatorAssignment(data) {
        var coordinator_assignment = {
            coordinator_assignment_id: data.coordinator_assignment_id,
            notes: data.notes
        };
        if (data.status == 'inactive') {
            coordinator_assignment.ended_timestamp = Date.now(),
                coordinator_assignment.status = data.status,
                coordinator_assignment.ended_by_admin_id = data.admin_id;
        }
        var coordinator_assignment_id = this.apisRepository.updateCoordinatorAssignment(coordinator_assignment);
        return coordinator_assignment_id;
    }
    async getCoordinatorDetails(coordinator_id) {
        var coordinatorx = await this.apisRepository.getCoordinator(coordinator_id);
        var coordinator = coordinatorx[0];
        var assignments = await this.apisRepository.getAssignmentsByCoordinatorId(coordinator_id);
        assignments.forEach((x) => {
            //get start and end dates
            x.assignment_start_date = this.commonService.getDate(x.assignment_created_timestamp);
            x.assignment_end_date = this.commonService.getDate(x.assignment_ended_timestamp);
        });
        return {
            coordinator: coordinator,
            assignments: assignments
        };
    }
    async getCoordinatorAssignment(coordinator_assignment_id) {
        var assignmentx = await this.apisRepository.getCoordinatorAssignment(coordinator_assignment_id);
        console.log('assignmentx', assignmentx);
        var assignment = assignmentx[0];
        var productionx = await this.apisRepository.getProduction(assignment.production_id);
        var coordinatorx = await this.apisRepository.getCoordinator(assignment.coordinator_id);
        return {
            coordinator_assignment: assignment,
            production: productionx[0],
            coordinator: coordinatorx[0]
        };
    }
    async getCoordinator(coordinator_id) {
        var coordinatorx = await this.apisRepository.getCoordinator(coordinator_id);
        return coordinatorx[0];
    }
    async getHealth() {
        //console.log('started....');
        var t0 = Date.now();
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        //check duplicated by email
        var duplicated_users_by_email_counter = 0;
        users.forEach((x, i) => {
            users.forEach((y, j) => {
                if (x.personal_email == y.personal_email && j > i) {
                    duplicated_users_by_email_counter += 1;
                    //console.log('---------duplicates by email!',x,y, ctr);
                }
            });
        });
        //check duplicated by email
        var duplicated_users_by_name_counter = 0;
        users.forEach((x, i) => {
            users.forEach((y, j) => {
                if (x.first_name == y.first_name && x.last_name == y.last_name && j > i) {
                    duplicated_users_by_name_counter += 1;
                    //console.log('---------duplicates by email!',x,y, ctr);
                }
            });
        });
        //console.log('e1', Date.now() - t0);
        //get unassigned users
        var unassigned_users_counter = 0;
        users.forEach((x) => {
            var assignments = production_assignments.filter((n) => { return n.user_id == x.user_id; });
            if (assignments.length == 0)
                unassigned_users_counter += 1;
            else {
                var active_assignment = assignments.find((n) => { return n.status == 'active'; });
                if (!active_assignment)
                    unassigned_users_counter += 1;
            }
        });
        //get unassigned users
        var inactive_users_counter = 0;
        users.forEach((x) => {
            if (x.last_login_time) {
                if (x.last_login_time < (Date.now() - (1000 * 60 * 60 * 24 * 365))) {
                    inactive_users_counter += 1;
                }
            }
        });
        //get unassigned users
        var approaching_one_year_counter = 0;
        users.forEach((x) => {
            if (!x.creation_time)
                return false;
            var one_year_mark = x.creation_time + (1000 * 60 * 60 * 24 * 400);
            var one_year_minus_two_months = x.creation_time + (1000 * 60 * 60 * 24 * 300);
            var now = Date.now();
            if (now >= one_year_minus_two_months && now <= one_year_mark)
                approaching_one_year_counter += 1;
        });
        /*
        //get similar users by email
        var similar_by_email_counter = 0;
        users.forEach((x:any, i:number) => {
            users.forEach((y:any, j:number) => {
                if (j > i){
                    var similarity = this.getSimilarity(x.personal_email, y.personal_email);
                    if (similarity > 0.9 && similarity < 1.0) similar_by_email_counter += 1;
                    //console.log('---------duplicates by email!',x,y, ctr);
                }
            });
        });

         //get similar users by email
        var similar_by_name_counter = 0;
        users.forEach((x:any, i:number) => {
            users.forEach((y:any, j:number) => {
                if (j > i){
                    var similarity = this.getSimilarity((x.first_name + ' ' + x.last_name), (y.first_name + ' ' + y.last_name));
                    if (similarity > 0.9 && similarity < 1.0) similar_by_name_counter += 1;
                    //console.log('---------duplicates by email!',x,y, ctr);
                }
            });
        });
        */
        //console.log('e3', Date.now() - t0);
        return {
            duplicated_users_by_name: duplicated_users_by_name_counter,
            duplicated_users_by_email: duplicated_users_by_email_counter,
            unassigned_users: unassigned_users_counter,
            inactive_users: inactive_users_counter,
            approaching_one_year: approaching_one_year_counter,
            //similar_by_name: similar_by_email_counter
        };
    }
    async getActivity() {
        var activity = await this.apisRepository.getReportActions();
        activity.forEach((x) => {
            x.date = this.commonService.getDate(x.timestamp);
        });
        return activity;
    }
    async getDuplicatedUsersByEmail() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        //check duplicated by email
        var duplicated_users = [];
        users.forEach((x, i) => {
            users.forEach((y, j) => {
                if (x.personal_email == y.personal_email && j > i) {
                    var user1 = x;
                    var user1_productions = production_assignments.filter((n) => { return n.user_id == x.user_id; });
                    user1_productions.forEach((n) => {
                        var productionx = productions.find((s) => { return n.production_id == s.production_id; });
                        if (productionx)
                            n.name = productionx.name;
                    });
                    user1.assignments = user1_productions;
                    var user2 = y;
                    var user2_productions = production_assignments.filter((n) => { return n.user_id == y.user_id; });
                    user2_productions.forEach((n) => {
                        var productionx = productions.find((s) => { return n.production_id == s.production_id; });
                        if (productionx)
                            n.name = productionx.name;
                    });
                    user2.assignments = user2_productions;
                    duplicated_users.push({
                        user1: user1,
                        user2: user2
                    });
                }
            });
        });
        return duplicated_users;
    }
    async getDuplicatedUsersByName() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        //check duplicated by email
        var duplicated_users = [];
        users.forEach((x, i) => {
            users.forEach((y, j) => {
                if (x.first_name == y.first_name && x.last_name == y.last_name && j > i) {
                    var user1 = x;
                    var user1_productions = production_assignments.filter((n) => { return n.user_id == x.user_id; });
                    user1_productions.forEach((n) => {
                        var productionx = productions.find((s) => { return n.production_id == s.production_id; });
                        if (productionx)
                            n.name = productionx.name;
                    });
                    user1.assignments = user1_productions;
                    var user2 = y;
                    var user2_productions = production_assignments.filter((n) => { return n.user_id == y.user_id; });
                    user2_productions.forEach((n) => {
                        var productionx = productions.find((s) => { return n.production_id == s.production_id; });
                        if (productionx)
                            n.name = productionx.name;
                    });
                    user2.assignments = user2_productions;
                    duplicated_users.push({
                        user1: user1,
                        user2: user2
                    });
                }
            });
        });
        return duplicated_users;
    }
    async getUnassignedUsers() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        users.forEach((x) => {
            x.assignments = production_assignments.filter((n) => { return n.user_id == x.user_id; }).length;
        });
        var unassigned_users = users.filter((x) => { return x.assignments == 0; });
        unassigned_users.forEach((x) => {
            x.name = x.first_name + ' ' + x.last_name;
            x.last_login_date = this.commonService.getDate(x.last_login_time);
        });
        return unassigned_users;
    }
    async getInactiveUsers() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        //get unassigned users
        var inactive_users = users.filter((x) => {
            if (x.last_login_time) {
                if (x.last_login_time < (Date.now() - (1000 * 60 * 60 * 24 * 365)))
                    return true;
            }
            else
                return false;
        });
        inactive_users.forEach((x) => {
            var assignment = production_assignments.find((n) => { return n.user_id == x.user_id && n.status == 'active'; });
            if (assignment) {
                var production = productions.find((n) => { return n.production_id == assignment.production_id; });
                if (production)
                    x.assignment_name = production.name;
            }
        });
        inactive_users.forEach((x) => {
            x.name = x.first_name + ' ' + x.last_name;
            x.last_login_date = this.commonService.getDate(x.last_login_time);
        });
        return inactive_users;
    }
    async getSimilarByEmail() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        //check duplicated by email
        var similar_users = [];
        users.forEach((x, i) => {
            users.forEach((y, j) => {
                if (j > i) {
                    var similarity = this.getSimilarity(x.personal_email, y.personal_email);
                    if (similarity > 0.9 && similarity < 1.0) {
                        var user1 = x;
                        var user1_productions = production_assignments.filter((n) => { return n.user_id == x.user_id; });
                        user1_productions.forEach((n) => {
                            var productionx = productions.find((s) => { return n.production_id == s.production_id; });
                            if (productionx)
                                n.name = productionx.name;
                        });
                        user1.assignments = user1_productions;
                        var user2 = y;
                        var user2_productions = production_assignments.filter((n) => { return n.user_id == y.user_id; });
                        user2_productions.forEach((n) => {
                            var productionx = productions.find((s) => { return n.production_id == s.production_id; });
                            if (productionx)
                                n.name = productionx.name;
                        });
                        user2.assignments = user2_productions;
                        similar_users.push({
                            user1: user1,
                            user2: user2
                        });
                    }
                }
            });
        });
        return similar_users;
    }
    async getSimilarByName() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        //check duplicated by email
        var similar_users = [];
        users.forEach((x, i) => {
            users.forEach((y, j) => {
                if (j > i) {
                    //var similarity = this.getSimilarity(x.personal_email, y.personal_email);
                    var similarity = this.getSimilarity((x.first_name + ' ' + x.last_name), (y.first_name + ' ' + y.last_name));
                    if (similarity > 0.9 && similarity < 1.0) {
                        var user1 = x;
                        var user1_productions = production_assignments.filter((n) => { return n.user_id == x.user_id; });
                        user1_productions.forEach((n) => {
                            var productionx = productions.find((s) => { return n.production_id == s.production_id; });
                            if (productionx)
                                n.name = productionx.name;
                        });
                        user1.assignments = user1_productions;
                        var user2 = y;
                        var user2_productions = production_assignments.filter((n) => { return n.user_id == y.user_id; });
                        user2_productions.forEach((n) => {
                            var productionx = productions.find((s) => { return n.production_id == s.production_id; });
                            if (productionx)
                                n.name = productionx.name;
                        });
                        user2.assignments = user2_productions;
                        similar_users.push({
                            user1: user1,
                            user2: user2
                        });
                    }
                }
            });
        });
        return similar_users;
    }
    async getApproachingOneYear() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        var users_approaching_one_year = users.filter((x) => {
            //return users that between 10 and 12 months
            if (!x.creation_time)
                return false;
            var one_year_mark = x.creation_time + (1000 * 60 * 60 * 24 * 400);
            var one_year_minus_two_months = x.creation_time + (1000 * 60 * 60 * 24 * 300);
            var now = Date.now();
            if (now >= one_year_minus_two_months && now <= one_year_mark)
                return true;
            else
                return false;
        });
        users_approaching_one_year.forEach((x) => {
            var assignment = production_assignments.find((n) => { return n.user_id == x.user_id && n.status == 'active'; });
            if (assignment) {
                var production = productions.find((n) => { return n.production_id == assignment.production_id; });
                if (production)
                    x.assignment_name = production.name;
            }
        });
        users_approaching_one_year.forEach((x) => {
            x.name = x.first_name + ' ' + x.last_name;
            x.last_login_date = this.commonService.getDate(x.last_login_time);
            x.creation_date = this.commonService.getDate(x.creation_time);
            var one_year_mark = x.creation_time + (1000 * 60 * 60 * 24 * 365);
            x.days_to_one_year = Math.round((one_year_mark - Date.now()) / (1000 * 60 * 60 * 24));
        });
        users_approaching_one_year = users_approaching_one_year.sort((a, b) => { return a.days_to_one_year - b.days_to_one_year; });
        return users_approaching_one_year;
    }
    getLevenshteinDistance(a, b) {
        const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
        for (let j = 0; j <= a.length; j++)
            matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                matrix[i][j] = b[i - 1] === a[j - 1]
                    ? matrix[i - 1][j - 1]
                    : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
            }
        }
        return matrix[b.length][a.length];
    }
    getSimilarity(str1, str2, threshold = 0.8) {
        const s1 = str1.toLowerCase().trim();
        const s2 = str2.toLowerCase().trim();
        if (s1 === s2)
            return 1; // Exact match
        const distance = this.getLevenshteinDistance(s1, s2);
        const maxLength = Math.max(s1.length, s2.length);
        // Calculate similarity: 1 - (distance / total length)
        const similarity = 1 - (distance / maxLength);
        return similarity; //>= threshold;
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