import { injectable, inject, delay } from 'tsyringe';
import { ReportsRepository, IReportsRepository } from '@/repositories/reports.repository';
import { CommonService } from './common.service';


@injectable()
export class ReportsService {

    constructor(
        @inject(ReportsRepository) private reportsRepository: IReportsRepository,
        @inject(CommonService) private commonService: CommonService
    ) { }

    public async getDashboardData() {

        console.log('get dashboard data');
        
        var users = await this.reportsRepository.getUsers();
        var assignments = await this.reportsRepository.getProductionAssignments();
        var productions = await this.reportsRepository.getProductions();
        var historical_data = await this.reportsRepository.getHistoricalData();

        //console.log('productions.length', productions.length);
        //console.log('assignments.length', assignments.length);

        //get how many assignments for each production
        productions.forEach((production:any) => {
            //get active assignments
            var production_assignments = assignments.filter((x:any) => { 
                return ((x.production_id == production.production_id) && x.status == 'active')
            });

            production.active_users = production_assignments.length;
        });

        //filter productions with 0 active users
        //productions = productions.filter((x:any) => { return x.active_users > 0});
        productions = productions.sort((a:any, b:any) => { return b.active_users - a.active_users});


        var domains = [
            { domain: 'crew-tv', users: 0 },
            { domain: 'seriescrew', users: 0 },
            { domain: 'mount22prod', users: 0 },
        ]
        users.forEach((x:any) => {
            if (x.production_email.indexOf('crew-tv') > -1) domains[0].users += 1;
            if (x.production_email.indexOf('seriescrew') > -1) domains[1].users += 1;
            if (x.production_email.indexOf('mount22prod') > -1) domains[2].users += 1;
        })

        domains = domains.sort((a:any, b:any) => { return b.users - a.users });

        //check productions per domain
        domains.forEach((domain: any) => {

            var usersx = users.filter((x: any) => { return x.production_email.indexOf(domain.domain) > -1; });
            var users_ids = usersx.map((x: any) => { return x.user_id; });

            var domain_productions = [] as any[];

            assignments.forEach((x: any) => {
                //console.log('---------');
                var is_domain_user = users_ids.indexOf(x.user_id) > -1;

                if (is_domain_user) {
                    //find production
                    var production = productions.find((m: any) => { return m.production_id == x.production_id });

                    //see if production is already in array
                    var record = domain_productions.find((m: any) => { return m.name == production.name; });

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
        historical_data.forEach((x:any) => {
            x.date = this.commonService.getDate(x.timestamp);
        });

        return {
            productions: productions,
            domains: domains,
            historical_data: historical_data
        };

    }

   
}
