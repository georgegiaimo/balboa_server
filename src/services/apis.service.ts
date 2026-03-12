import { injectable, inject, delay } from 'tsyringe';
import { ApisRepository, IApisRepository } from '@/repositories/apis.repository';
import { all } from 'axios';
import { CommonService } from './common.service';


@injectable()
export class ApisService {

    constructor(@inject(ApisRepository) private apisRepository: IApisRepository,
    @inject(CommonService) public commonService: CommonService) { }

    public async getProductions() {
        var assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();

        var coordinators = await this.apisRepository.getCoordinators();
        var coordinator_assignments = await this.apisRepository.getCoordinatorAssignments();

        //console.log('productions.length', productions.length);
        //console.log('assignments.length', assignments.length);

        //get how many assignments for each production
        productions.forEach((production:any) => {
            //get active assignments
            var production_assignments = assignments.filter((x:any) => { 
                return ((x.production_id == production.production_id) && x.status == 'active')
            });

            production.active_users = production_assignments.length;

            var coordinators_ids = 
            coordinator_assignments.filter((x:any) => { return x.production_id == production.production_id}).map((x:any) => { return x.coordinator_id });
            
            var production_coordinators = coordinators.filter((x:any) => {
                return coordinators_ids.indexOf(x.coordinator_id) > -1;
            });

            production.coordinators = production_coordinators;

        });

        //filter productions with 0 active users
        //productions = productions.filter((x:any) => { return x.active_users > 0});
        productions = productions.sort((a:any, b:any) => { return b.active_users - a.active_users});

        return productions;
    }

    public async getProductionDetails(production_id:number) {
        var productionx = await this.apisRepository.getProductionDetails(production_id);
        var production = productionx[0];
        var coordinators = await this.apisRepository.getProductionCoordinators(production_id);
        var users = await this.apisRepository.getProductionUsers(production_id);

        //check assignments for each user
        users.forEach((x:any) => {
           x.last_login_date = this.commonService.getDate(x.last_login_time);
        })

        return {
            production: production,
            users: users,
            coordinators: coordinators
        }
    }

    public async getUserDetails(user_id:number){
        var userx = await this.apisRepository.getUserDetails(user_id);
        var user = userx[0];
        var assignments = await this.apisRepository.getUserAssignments(user_id);

        assignments.forEach((x:any) => {
            //get start and end dates
            x.assignment_start_date = this.commonService.getDate(x.created_timestamp);
            x.assignment_end_date = this.commonService.getDate(x.ended_timestamp);
        });

        user.last_login_date = this.commonService.getDate(user.last_login_time);

        return {
            user: user,
            assignments: assignments
        }

    }

    
    public async getUsers(){

        var users = await this.apisRepository.getUsers();
        var assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();

        //check assignments for each user
        users.forEach((user:any) => {
            var assignmentsx = assignments.filter((x:any) => { return x.user_id == user.user_id });
            
            var productionsx = [] as any[];
            assignmentsx.forEach((n:any) => {
                var production = productions.find((m:any) => { return m.production_id == n.production_id});
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

    public async getDomainDetails(domain:string){
        
        var productionsx = await this.apisRepository.getProductions();
        var assignments = await this.apisRepository.getProductionAssignments();
        var usersx = await this.apisRepository.getUsers();

        var users = usersx.filter((x:any) => { return x.production_email.indexOf(domain) > -1; });
        var users_ids = users.map((x:any) => { return x.user_id; });

        var productions = [] as any[];

        assignments.forEach((x:any) => {
            var is_domain_user = users_ids.indexOf(x.user_id) > -1;

            if (is_domain_user) {
                //find production
                var production = productionsx.find((m:any) => { return m.production_id == x.production_id });

                //see if production is already in array
                var record = productions.find((m:any) => { return m.name == production.name;});

                if (record){
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
        }

    }

    public async getAdmins(){

        var admins = await this.apisRepository.getAdmins();
        
        admins.forEach((x:any) => {
            x.created_date = this.commonService.getDate(x.created_timestamp);
            x.last_login_date = this.commonService.getDate(x.last_login);
        })
        
        return admins;
    }

    public async addAdmin(first_name:string, last_name:string, email:string, role:string){

        var object = {
            first_name, 
            last_name, 
            email, 
            role,
            created_timestamp: Date.now()
        }

        var admin_id = await this.apisRepository.addAdmin(object);
        return admin_id;
    }

    public async getAdmin(admin_id:number){

        var admins = await this.apisRepository.getAdmin(admin_id);

        admins.forEach((x:any) => {
            x.created_date = this.commonService.getDate(x.created_timestamp);
            x.last_login_date = this.commonService.getDate(x.last_login);
        })
        
        return admins;
    }

    public async updateAdmin(object:any){

        var admin_id = await this.apisRepository.updateAdmin(object);
        return admin_id;
    }

    public async getCoordinators(){

        var coordinators = await this.apisRepository.getCoordinators();      
        return coordinators;
    }
    
}