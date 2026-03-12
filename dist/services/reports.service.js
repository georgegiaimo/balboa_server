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
exports.ReportsService = void 0;
const tsyringe_1 = require("tsyringe");
const reports_repository_1 = require("../repositories/reports.repository");
const common_service_1 = require("./common.service");
let ReportsService = class ReportsService {
    constructor(reportsRepository, commonService) {
        this.reportsRepository = reportsRepository;
        this.commonService = commonService;
    }
    async getDashboardData() {
        console.log('get dashboard data');
        var users = await this.reportsRepository.getUsers();
        var assignments = await this.reportsRepository.getProductionAssignments();
        var productions = await this.reportsRepository.getProductions();
        var historical_data = await this.reportsRepository.getHistoricalData();
        //console.log('productions.length', productions.length);
        //console.log('assignments.length', assignments.length);
        //get how many assignments for each production
        productions.forEach((production) => {
            //get active assignments
            var production_assignments = assignments.filter((x) => {
                return ((x.production_id == production.production_id) && x.status == 'active');
            });
            production.active_users = production_assignments.length;
        });
        //filter productions with 0 active users
        //productions = productions.filter((x:any) => { return x.active_users > 0});
        productions = productions.sort((a, b) => { return b.active_users - a.active_users; });
        var domains = [
            { domain: 'crew-tv', users: 0 },
            { domain: 'seriescrew', users: 0 },
            { domain: 'mount22prod', users: 0 },
        ];
        users.forEach((x) => {
            if (x.production_email.indexOf('crew-tv') > -1)
                domains[0].users += 1;
            if (x.production_email.indexOf('seriescrew') > -1)
                domains[1].users += 1;
            if (x.production_email.indexOf('mount22prod') > -1)
                domains[2].users += 1;
        });
        domains = domains.sort((a, b) => { return b.users - a.users; });
        //check productions per domain
        domains.forEach((domain) => {
            var usersx = users.filter((x) => { return x.production_email.indexOf(domain.domain) > -1; });
            var users_ids = usersx.map((x) => { return x.user_id; });
            var domain_productions = [];
            assignments.forEach((x) => {
                //console.log('---------');
                var is_domain_user = users_ids.indexOf(x.user_id) > -1;
                if (is_domain_user) {
                    //find production
                    var production = productions.find((m) => { return m.production_id == x.production_id; });
                    //see if production is already in array
                    var record = domain_productions.find((m) => { return m.name == production.name; });
                    if (record) {
                        record.users += 1;
                    }
                    else {
                        production.users = 1;
                        domain_productions.push(production);
                    }
                }
            });
            domain.productions = domain_productions.length;
        });
        //get user friendly data for historicals
        historical_data.forEach((x) => {
            x.date = this.commonService.getDate(x.timestamp);
        });
        return {
            productions: productions,
            domains: domains,
            historical_data: historical_data
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(reports_repository_1.ReportsRepository)),
    __param(1, (0, tsyringe_1.inject)(common_service_1.CommonService)),
    __metadata("design:paramtypes", [Object, common_service_1.CommonService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map