import { injectable, inject, delay } from 'tsyringe';
import { ApisRepository, IApisRepository } from '@/repositories/apis.repository';
import { all } from 'axios';
import { CommonService } from './common.service';
import { SendGridService } from './sendgrid.service';
import { Send } from 'express';


@injectable()
export class ApisService {

    constructor(
        @inject(ApisRepository) private apisRepository: IApisRepository,
        @inject(CommonService) public commonService: CommonService,
        @inject(SendGridService) public sendgridService: SendGridService
    ) { }

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
        var coordinator_assignments = await this.apisRepository.getCoordinatorAssignments();
        var productions = await this.apisRepository.getProductions();

        coordinators.forEach((x:any) => {
            var assignments = coordinator_assignments.filter((n:any) => { return n.coordinator_id == x.coordinator_id});
            var production_ids = assignments.map((n:any) => { return n.production_id});
            var productionsx = productions.filter((n:any) => { return production_ids.indexOf(n.production_id) > -1});
            
            if (productionsx[0]) x.production = productionsx[0].name;
        })
              
        return coordinators;
    }

    public async getCoordinatorDetails(coordinator_id:number){
        var coordinatorx = await this.apisRepository.getCoordinator(coordinator_id);
        var coordinator = coordinatorx[0];
        var assignments = await this.apisRepository.getAssignmentsByCoordinatorId(coordinator_id);

        assignments.forEach((x:any) => {
            //get start and end dates
            x.assignment_start_date = this.commonService.getDate(x.created_timestamp);
            x.assignment_end_date = this.commonService.getDate(x.ended_timestamp);
        });

        return {
            coordinator: coordinator,
            assignments: assignments
        }

    }

    public async getHealth(){

        //console.log('started....');
        var t0 = Date.now();

        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();

        //check duplicated by email
        var duplicated_users_by_email_counter = 0;
        users.forEach((x:any, i:number) => {
            users.forEach((y:any, j:number) => {
                if (x.personal_email == y.personal_email && j > i){
                    duplicated_users_by_email_counter += 1;
                    //console.log('---------duplicates by email!',x,y, ctr);
                }
            });
        });

        //check duplicated by email
        var duplicated_users_by_name_counter = 0;
        users.forEach((x:any, i:number) => {
            users.forEach((y:any, j:number) => {
                if (x.first_name == y.first_name &&  x.last_name == y.last_name && j > i){
                    duplicated_users_by_name_counter += 1;
                    //console.log('---------duplicates by email!',x,y, ctr);
                }
            });
        });

        //console.log('e1', Date.now() - t0);

        //get unassigned users
        var unassigned_users_counter = 0;
        users.forEach((x:any) => {
            var assignments = production_assignments.filter((n:any) => { return n.user_id == x.user_id});
            if (assignments.length == 0) unassigned_users_counter += 1;
            else {
                var active_assignment = assignments.find((n:any) => {  return n.status == 'active'});
                if (!active_assignment) unassigned_users_counter += 1;
            }
        });

        //get unassigned users
        var inactive_users_counter = 0;
        users.forEach((x:any) => {
            if (x.last_login_time) {
                if (x.last_login_time < (Date.now() - (1000 * 60 * 60 * 24 * 365))){
                    inactive_users_counter += 1;
                }
            }
        });

        //get unassigned users
        var approaching_one_year_counter = 0;
        users.forEach((x:any) => {
            if (!x.creation_time) return false;
            var one_year_mark = x.creation_time + (1000 * 60 * 60 * 24 * 400);
            var one_year_minus_two_months = x.creation_time + (1000 * 60 * 60 * 24 * 300);
            var now = Date.now();
            if (now >= one_year_minus_two_months && now <= one_year_mark) approaching_one_year_counter += 1;
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
        }

    }

    public async getDuplicatedUsersByEmail(){
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();

        //check duplicated by email
        var duplicated_users:any[] = [];
        users.forEach((x:any, i:number) => {
            users.forEach((y:any, j:number) => {
                if (x.personal_email == y.personal_email && j > i){
                    
                    var user1 = x;
                    var user1_productions = production_assignments.filter((n:any) => { return n.user_id == x.user_id });

                    user1_productions.forEach((n:any) => {
                        var productionx = productions.find((s:any) => {return n.production_id == s.production_id});
                        if (productionx) n.name = productionx.name;
                    })
                    user1.assignments = user1_productions;

                    var user2 = y;
                    var user2_productions = production_assignments.filter((n:any) => { return n.user_id == y.user_id });

                    user2_productions.forEach((n:any) => {
                        var productionx = productions.find((s:any) => {return n.production_id == s.production_id});
                        if (productionx) n.name = productionx.name;
                    })
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

    public async getDuplicatedUsersByName(){
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();

        //check duplicated by email
        var duplicated_users:any[] = [];
        users.forEach((x:any, i:number) => {
            users.forEach((y:any, j:number) => {
                 if (x.first_name == y.first_name &&  x.last_name == y.last_name && j > i){
                    
                    var user1 = x;
                    var user1_productions = production_assignments.filter((n:any) => { return n.user_id == x.user_id });

                    user1_productions.forEach((n:any) => {
                        var productionx = productions.find((s:any) => {return n.production_id == s.production_id});
                        if (productionx) n.name = productionx.name;
                    })
                    user1.assignments = user1_productions;

                    var user2 = y;
                    var user2_productions = production_assignments.filter((n:any) => { return n.user_id == y.user_id });

                    user2_productions.forEach((n:any) => {
                        var productionx = productions.find((s:any) => {return n.production_id == s.production_id});
                        if (productionx) n.name = productionx.name;
                    })
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

    public async getUnassignedUsers(){

        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        
        users.forEach((x:any) => {
            x.assignments = production_assignments.filter((n:any) => { return n.user_id == x.user_id}).length;
        });

        var unassigned_users = users.filter((x:any) => { return x.assignments == 0});

        unassigned_users.forEach((x:any) => {
            x.name = x.first_name + ' ' + x.last_name;
            x.last_login_date = this.commonService.getDate(x.last_login_time);
        })

        return unassigned_users;

    }

    public async getInactiveUsers(){

        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();
        
        //get unassigned users
        var inactive_users = users.filter((x:any) => {
            if (x.last_login_time) {
                if (x.last_login_time < (Date.now() - (1000 * 60 * 60 * 24 * 365))) return true;
            }
            else return false;
        });

        inactive_users.forEach((x:any) => {
            var assignment = production_assignments.find((n:any) => { return n.user_id == x.user_id && n.status == 'active'});
            if (assignment){
                var production = productions.find((n:any) => { return n.production_id == assignment.production_id });
                if (production) x.assignment_name = production.name;
            }
        })

        inactive_users.forEach((x:any) => {
            x.name = x.first_name + ' ' + x.last_name;
            x.last_login_date = this.commonService.getDate(x.last_login_time);
        })

        return inactive_users;

    }

    public async getSimilarByEmail() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();

        //check duplicated by email
        var similar_users: any[] = [];
        users.forEach((x: any, i: number) => {
            users.forEach((y: any, j: number) => {
                if (j > i) {

                    var similarity = this.getSimilarity(x.personal_email, y.personal_email);
                    if (similarity > 0.9 && similarity < 1.0) {
                        var user1 = x;
                        var user1_productions = production_assignments.filter((n: any) => { return n.user_id == x.user_id });

                        user1_productions.forEach((n: any) => {
                            var productionx = productions.find((s: any) => { return n.production_id == s.production_id });
                            if (productionx) n.name = productionx.name;
                        })
                        user1.assignments = user1_productions;

                        var user2 = y;
                        var user2_productions = production_assignments.filter((n: any) => { return n.user_id == y.user_id });

                        user2_productions.forEach((n: any) => {
                            var productionx = productions.find((s: any) => { return n.production_id == s.production_id });
                            if (productionx) n.name = productionx.name;
                        })
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

    public async getSimilarByName() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();

        //check duplicated by email
        var similar_users: any[] = [];
        users.forEach((x: any, i: number) => {
            users.forEach((y: any, j: number) => {
                if (j > i) {

                    //var similarity = this.getSimilarity(x.personal_email, y.personal_email);
                    var similarity = this.getSimilarity((x.first_name + ' ' + x.last_name), (y.first_name + ' ' + y.last_name));
                    if (similarity > 0.9 && similarity < 1.0) {
                        var user1 = x;
                        var user1_productions = production_assignments.filter((n: any) => { return n.user_id == x.user_id });

                        user1_productions.forEach((n: any) => {
                            var productionx = productions.find((s: any) => { return n.production_id == s.production_id });
                            if (productionx) n.name = productionx.name;
                        })
                        user1.assignments = user1_productions;

                        var user2 = y;
                        var user2_productions = production_assignments.filter((n: any) => { return n.user_id == y.user_id });

                        user2_productions.forEach((n: any) => {
                            var productionx = productions.find((s: any) => { return n.production_id == s.production_id });
                            if (productionx) n.name = productionx.name;
                        })
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

    public async getApproachingOneYear() {
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();

        
        var users_approaching_one_year = users.filter((x:any) => {
            //return users that between 10 and 12 months
            if (!x.creation_time) return false;
            var one_year_mark = x.creation_time + (1000 * 60 * 60 * 24 * 400);
            var one_year_minus_two_months = x.creation_time + (1000 * 60 * 60 * 24 * 300);
            var now = Date.now();

            if (now >= one_year_minus_two_months && now <= one_year_mark) return true;
            else return false;
            
        });

        users_approaching_one_year.forEach((x:any) => {
            var assignment = production_assignments.find((n:any) => { return n.user_id == x.user_id && n.status == 'active'});
            if (assignment){
                var production = productions.find((n:any) => { return n.production_id == assignment.production_id });
                if (production) x.assignment_name = production.name;
            }
        });

        users_approaching_one_year.forEach((x:any) => {
            x.name = x.first_name + ' ' + x.last_name;
            x.last_login_date = this.commonService.getDate(x.last_login_time);
            x.creation_date = this.commonService.getDate(x.creation_time);

            var one_year_mark = x.creation_time + (1000 * 60 * 60 * 24 * 365);
            x.days_to_one_year = Math.round((one_year_mark - Date.now())/(1000 * 60 * 60 * 24));
        });

        users_approaching_one_year = users_approaching_one_year.sort((a:any, b:any) => { return a.days_to_one_year - b.days_to_one_year});
        
        return users_approaching_one_year;
    }

    getLevenshteinDistance(a: string, b: string): number {
        const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                matrix[i][j] = b[i - 1] === a[j - 1]
                    ? matrix[i - 1][j - 1]
                    : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
            }
        }
        return matrix[b.length][a.length];
    }

    getSimilarity(str1: string, str2: string, threshold: number = 0.8): number {
        const s1 = str1.toLowerCase().trim();
        const s2 = str2.toLowerCase().trim();

        if (s1 === s2) return 1; // Exact match

        const distance = this.getLevenshteinDistance(s1, s2);
        const maxLength = Math.max(s1.length, s2.length);

        // Calculate similarity: 1 - (distance / total length)
        const similarity = 1 - (distance / maxLength);

        return similarity; //>= threshold;
    }
    
}