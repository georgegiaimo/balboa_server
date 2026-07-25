import { injectable, inject, delay } from 'tsyringe';
import { ApisRepository, IApisRepository } from '@/repositories/apis.repository';
import { all } from 'axios';
import { CommonService } from './common.service';
import { SendGridService } from './sendgrid.service';
import { Send } from 'express';
import { EmailNotificationsService } from './email_notifications';


@injectable()
export class ApisService {

    constructor(
        @inject(ApisRepository) private apisRepository: IApisRepository,
        @inject(CommonService) public commonService: CommonService,
        @inject(SendGridService) public sendgridService: SendGridService,
        @inject(EmailNotificationsService) public emailNotificationsService: EmailNotificationsService
    ) { }

    public async getProductions() {
        var assignments = await this.apisRepository.getProductionAssignments();
        var productions = await this.apisRepository.getProductions();

        var coordinators = await this.apisRepository.getCoordinators();
        var coordinator_assignments = await this.apisRepository.getCoordinatorAssignments();

        var status_orders = ['Canceled','Paused', 'Completed', 'Post Production', 'Writers Room', 'Active'];
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

            if (production.start_date) production.start_date_timestamp = this.commonService.getNoonEpoch(production.start_date);
            else production.start_date_timestamp = 0;

            production.coordinators = production_coordinators;

        });

        //filter productions with 0 active users
        //productions = productions.filter((x:any) => { return x.active_users > 0});
        productions = productions.sort((a:any, b:any) => { 
            return status_orders.indexOf(b.status) - status_orders.indexOf(a.status);
        });

        return productions;
    }

    public async getProductionDetails(production_id:number) {
        var productionx = await this.apisRepository.getProductionDetails(production_id);
        var production = productionx[0];
        var coordinators = await this.apisRepository.getProductionCoordinators(production_id);
        var users = await this.apisRepository.getProductionUsersX(production_id);
        var activity = await this.apisRepository.getProductionActivity(production_id);

        //format date
        users.forEach((x:any) => {
           //x.last_login_date = this.commonService.getDate(x.last_login_time);
           //calculate pct usage
           //x.usage_percentage = Math.round((x.total_used_mb/x.limit_mb)*100);
           x.assignment_start_date = this.commonService.getDate(x.assignment_created_timestamp);
           x.assignment_end_date = this.commonService.getDate(x.assignment_ended_timestamp);
        });

        //remove user duplicates
        const uniqueUsers = [...new Map(users.map((user:any) => [user.user_id, user])).values()];

        activity.forEach((x:any) => {
            x.date = this.commonService.getDate(x.timestamp);
        });

        activity = activity.sort((a:any,b:any) => { return b.timestamp - a.timestamp });

        return {
            production: production,
            users: uniqueUsers,
            coordinators: coordinators,
            activity: activity
        }
    }

    public async getProductionHistory(production_id:number){
        var activity = await this.apisRepository.getProductionUsersX(production_id);
        //console.log('activity', activity);
        activity.forEach((x:any) => {
            x.assignment_start_date = this.commonService.getDate(x.assignment_created_timestamp);
            x.assignment_end_date = this.commonService.getDate(x.assignment_ended_timestamp);
        });

        var history = this.getMonthlyAssignmentTimeline(activity);

        return {
            history: history
        };
    }

    public async updateProduction(object:any){

        var production_id = await this.apisRepository.updateProduction(object);
        return production_id;
    }

    public async getUserDetails(user_id:number){
        var userx = await this.apisRepository.getUserDetails(user_id);
        var user = userx[0];
        var assignments = await this.apisRepository.getUserAssignments(user_id);
        var added_userx = await this.apisRepository.getAddedUserByEmail(user.personal_email);
        var added_user = added_userx[0];

        assignments.forEach((x:any) => {
            //get start and end dates
            x.assignment_start_date = this.commonService.getDate(x.started_timestamp);
            x.assignment_end_date = this.commonService.getDate(x.ended_timestamp);
        });

        if (added_user){
            if (added_user.notification_sendgrid_message_delivered) added_user.notification_date = this.commonService.getDate(added_user.notification_sent_timestamp);
            if (added_user.reminder_one_sendgrid_message_delivered) added_user.reminder1_date = this.commonService.getDate(added_user.reminder_one_sent_timestamp);
            if (added_user.reminder_two_sendgrid_message_delivered) added_user.reminder2_date = this.commonService.getDate(added_user.reminder_two_sent_timestamp);
        }

        user.last_login_date = this.commonService.getDate(user.last_login_time);
        user.creation_date = this.commonService.getDate(user.creation_time);
        user.usage_percentage = Math.round((user.total_used_mb/user.limit_mb)*100);

        return {
            user: user,
            assignments: assignments,
            added_user: added_user
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
                //if (!production) console.log('production', production, n);
                production.assignment_status = n.status;
                //get start and end dates
                production.assignment_start_date = this.commonService.getDate(n.created_timestamp);
                production.assignment_end_date = this.commonService.getDate(n.ended_timestamp);
                productionsx.push(production);
            });

            user.productions = productionsx;
            user.last_login_date = this.commonService.getDate(user.last_login_time);
            user.creation_date = this.commonService.getDate(user.creation_time);
            user.usage_percentage = Math.round((user.total_used_mb/user.limit_mb)*100);
        });

        //console.log('users', users);

        return users;
    }

    public async updateUser(object:any){

        var user_id = await this.apisRepository.updateUser(object);
        return user_id;
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

        var admin_id = this.apisRepository.updateAdmin(object);
        return admin_id;
    }

    public async deleteAdmin(object:any){

        var admin_id = await this.apisRepository.deleteAdmin(object.admin_id);
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
            assignments.forEach((n:any) => {
                var record = productions.find((m:any) => { return m.production_id == n.production_id});
                if (record) n.production_name = record.name;
            });
            x.assignments = assignments;
            if (x.assignments.length == 0) x.status = 'unassigned';
            else {
                //check if there s an active assignment
                var recordx = assignments.find((n:any) => { return n.status == 'active'});
                if (recordx) x.status = 'active';
                else x.status = 'unknown';
            }
        });
              
        return coordinators;
    }

    public async addCoordinator(data:any){

        var coordinator = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            created_timestamp: Date.now(),
            notes: data.notes,
            is_executive: data.is_executive 
        }

        var coordinator_id = this.apisRepository.addCoordinator(coordinator);

        return coordinator_id;

    }

    public async updateCoordinator(data:any){

        var coordinator = {
            coordinator_id: data.coordinator_id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            notes: data.notes,
            is_executive: data.is_executive 
        }

        var result = await this.apisRepository.updateCoordinator(coordinator);

        return result;

    }

    public async addCoordinatorAssignment(data:any){

        var coordinator_assignment = {
            coordinator_id: data.coordinator_id,
            production_id: data.production_id,
            notes: data.notes,
            created_timestamp: Date.now(),
            created_by_admin_id: data.admin_id,
            status: data.status
        }

        var coordinator_assignment_id = this.apisRepository.addCoordinatorAssignment(coordinator_assignment);

        return coordinator_assignment_id;

    }

    public async updateCoordinatorAssignment(data:any){

        var coordinator_assignment:any = {
            coordinator_assignment_id: data.coordinator_assignment_id,
            notes: data.notes
        }

        if (data.status == 'inactive'){
            coordinator_assignment.ended_timestamp = Date.now(),
            coordinator_assignment.status = data.status,
            coordinator_assignment.ended_by_admin_id = data.admin_id
        }

        var coordinator_assignment_id = this.apisRepository.updateCoordinatorAssignment(coordinator_assignment);

        return coordinator_assignment_id;

    }

    public async getCoordinatorDetails(coordinator_id:number){
        var coordinatorx = await this.apisRepository.getCoordinator(coordinator_id);
        var coordinator = coordinatorx[0];
        var assignments = await this.apisRepository.getAssignmentsByCoordinatorId(coordinator_id);

        assignments.forEach((x:any) => {
            //get start and end dates
            x.assignment_start_date = this.commonService.getDate(x.assignment_created_timestamp);
            x.assignment_end_date = this.commonService.getDate(x.assignment_ended_timestamp);
        });

        return {
            coordinator: coordinator,
            assignments: assignments
        }

    }

    public async getCoordinatorAssignment(coordinator_assignment_id:number){
        var assignmentx = await this.apisRepository.getCoordinatorAssignment(coordinator_assignment_id);
        var assignment = assignmentx[0];
        var productionx = await this.apisRepository.getProduction(assignment.production_id);
        var coordinatorx = await this.apisRepository.getCoordinator(assignment.coordinator_id);
        
        return {
            coordinator_assignment: assignment,
            production: productionx[0],
            coordinator: coordinatorx[0]
        }
    }

    public async getCoordinator(coordinator_id:number){

        var coordinatorx = await this.apisRepository.getCoordinator(coordinator_id);
        return coordinatorx[0];
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

    public async getActivity(){
        var activity = await this.apisRepository.getReportActions();

        activity.forEach((x:any) => {
            x.date = this.commonService.getDate(x.timestamp);
        });

        return activity;
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
        console.log('here g')
        var users = await this.apisRepository.getUsers();
        var production_assignments = await this.apisRepository.getProductionAssignments();
        
        users.forEach((x:any) => {
            x.assignments = production_assignments.filter((n:any) => { return n.user_id == x.user_id}).length;
        });

        var unassigned_users = users.filter((x:any) => { return x.assignments == 0 && x.status != 'removed'});

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

    public async getGoogleUsers(){
        var google_users = this.apisRepository.getGoogleUsers();
        return google_users;
    }

    async addProductionAssignment(data:any) {
        var production_assignment = {
            user_id: data.user_id,
            production_id: data.production_id,
            notes: data.notes,
            created_timestamp: data.start_date ? this.commonService.getNoonEpoch(data.start_date):null,
            ended_timestamp: data.end_date ? this.commonService.getNoonEpoch(data.end_date):null,
            status: data.status
        };
        var production_assignment_id = await this.apisRepository.addProductionAssignment(production_assignment);
        return production_assignment_id;
    }
    async updateProductionAssignment(data:any) {
        var production_assignment = {
            production_assignment_id: data.production_assignment_id,
            user_id: data.user_id,
            production_id: data.production_id,
            notes: data.notes,
            created_timestamp: this.commonService.getNoonEpoch(data.start_date),
            ended_timestamp: this.commonService.getNoonEpoch(data.end_date),
            status: data.status
        };
        var production_assignment_id = await this.apisRepository.updateProductionAssignment(production_assignment);
        return production_assignment_id;
    }

    async deleteProductionAssignment(data:any) {
        
        var production_assignment_id = await this.apisRepository.deleteProductionAssignment(data.production_assignment_id);
        return production_assignment_id;
    }

    async accountLoginReminders(){
        var added_users = await this.apisRepository.getAddedUsers();
        var users = await this.apisRepository.getUsers();

        for (let user of added_users){

            if (user.has_logged_in) continue;

            var user_has_logged_in = false;

            if (!user.user_id){
                //find user and assign user id
                var record = users.find((x:any) => { return x.personal_email.toLowerCase() == user.personal_email.toLowerCase()});
                if (record){
                    var object = {
                        added_user_id: user.added_user_id,
                        user_id: record.user_id,
                        has_logged_in: record.last_login_time > 0
                    }

                    if (record.last_login_time > 0) user_has_logged_in = true;

                    await this.apisRepository.updateAddedUser(object);
                }
            }

            else{
                //confirm user hasnt logged in
                var record = users.find((x:any) => { return x.user_id == user.user_id});
                if (record){
                    var object = {
                        added_user_id: user.added_user_id,
                        user_id: record.user_id,
                        has_logged_in: record.last_login_time > 0
                    }

                    if (record.last_login_time > 0) user_has_logged_in = true;

                    await this.apisRepository.updateAddedUser(object);
                }
                
            }

            if (user_has_logged_in) continue;

            //verify status of user before sending email, if status equals 'removed' do not send email notifications anymore
            var record = users.find((x:any) => { return x.personal_email.toLowerCase() == user.personal_email.toLowerCase()});
            if (!record || (record && record.status == 'removed')) continue;
            

            if(!user.reminder_one_sendgrid_message_delivered && (Date.now() > (user.timestamp_created + (1000 * 60 * 60 * 24 * 3)))){
                //send reminder 1
                var sendgrid_response = await this.sendgridService.accountCreatedReminder1(user);
                var sendgrid_message_id = sendgrid_response.response[0].headers['x-message-id'];
                
                this.emailNotificationsService.saveEmailNotification({
                    personal_email: user.personal_email,
                    reminder_one_sendgrid_message_id: sendgrid_message_id
                });

            }

            else if(user.reminder_one_sendgrid_message_delivered && !user.reminder_two_sendgrid_message_delivered && (Date.now() > (user.timestamp_created + (1000 * 60 * 60 * 24 * 6)))){
                //send reminder 2
                var sendgrid_response = await this.sendgridService.accountCreatedReminder2(user);
                var sendgrid_message_id = sendgrid_response.response[0].headers['x-message-id'];

                this.emailNotificationsService.saveEmailNotification({
                    personal_email: user.personal_email,
                    reminder_two_sendgrid_message_id: sendgrid_message_id
                })
            }
        }
    }

    public async getProductionAssignment(production_assignment_id:number){
        var assignmentx = await this.apisRepository.getProductionAssignment(production_assignment_id);
        var assignment = assignmentx[0];
        var productionx = await this.apisRepository.getProduction(assignment.production_id);
        var userx = await this.apisRepository.getUser(assignment.user_id);

        assignment.start_date = this.commonService.getDate2(assignment.created_timestamp);
        assignment.end_date = this.commonService.getDate2(assignment.ended_timestamp);
        
        return {
            production_assignment: assignment,
            production: productionx[0],
            user: userx[0]
        }
    }

    public async createBulkUploadRun(){
        var run_id = await this.apisRepository.createBulkUploadRun();
        return run_id;
    }

    public async updateBulkUploadRun(run_id:number, status:string){
        
        var object = {
            bulk_upload_run_id: run_id,
            status: status
        }

        var response = await this.apisRepository.updateBulkUploadRun(object);
        return response;
    }

    public async getBulkUploadRun(run_id:number){
        var runx = await this.apisRepository.getBulkUploadRun(run_id);
        var run = runx[0];
        
        return run;
    }

  getMonthlyAssignmentTimeline(assignments: any[]){
  if (!assignments.length) return [];

  const now = new Date();
  // Standardize to the first of the current month for boundary comparison
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Find the earliest start date and the latest end date
  let earliest = new Date();
  let latest = new Date(currentMonthStart);

  const parsed = assignments.map(a => {
    const start = new Date(a.assignment_start_date);
    // If end date is missing, treat it as "ongoing" (current month)
    const end = a.assignment_end_date ? new Date(a.assignment_end_date) : new Date(now);

    if (start < earliest) earliest = new Date(start);
    if (end > latest) latest = new Date(end);

    return { start, end, first_name:a.first_name, last_name:a.last_name, assignment_start_date:a.assignment_start_date, assignment_end_date:a.assignment_end_date };
  });

  //console.log('parsed',parsed);

  // 2. Normalize boundaries to the first of the month
  let cursor = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const endLimit = new Date(latest.getFullYear(), latest.getMonth(), 1);

  const timeline: any[] = [];

  // 3. Iterate through months
  while (cursor <= endLimit) {
    //console.log('cursor', cursor);
    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);

    // 4. Count assignments active during this specific month window
    const activeCount = parsed.filter(({ start, end }) => {
      // Overlap logic: Start is before month ends AND End is after month starts
      return start <= monthEnd && (end >= monthStart || isNaN(end.getTime()));
    }).length;

    timeline.push({
      month: cursor.toLocaleString('en-US', { month: 'long' }),
      year: cursor.getFullYear(),
      count: activeCount,
      added: parsed.filter((x:any) => { return x.start <= monthEnd && x.start >= monthStart}),
      removed: parsed.filter((x:any) => { return x.end <= monthEnd && x.end >= monthStart}),
      change: parsed.filter((x:any) => { return x.start <= monthEnd && x.start >= monthStart}).length - parsed.filter((x:any) => { return x.end <= monthEnd && x.end >= monthStart}).length
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  //filter months with 0 users
  var timelinex = timeline.filter((x:any) => { return x.count > 0 && x.change != 0;})

  return timelinex;
};

    public async addUser(data: any) {

        var user_object: any = {
            first_name: data.first_name,
            last_name: data.last_name,
            personal_email: data.personal_email,
            creation_time: Date.now(),
            is_identity_client: data.is_identity_client,
            notes: data.notes,
            status: data.status? data.status:null,
            production_email: data.production_email ? data.prodution_email:null
        }

        var response = await this.apisRepository.addUser(user_object);
        return response;

    }

    public async sendgridWebhook(data: any) {

        for(let item of data){

            await this.storeEmailNotification(item);
            //console.log('email',item.email);
            //console.log('sg-message-id', item.sg_message_id);
            //console.log('event', item.event);  
        };

    }

    async storeEmailNotification(event:any) {

        try{
        console.log('apis.service storeEmailNotification', event);

        //get added_user record
        var added_userx = await this.apisRepository.getAddedUserByEmail(event.email);
        var added_user = added_userx[0];
        var object;

        var sg_message_id = event.sg_message_id.split('.')[0];

        console.log('xxxx', added_user, sg_message_id);

        if (added_user.notification_sendgrid_message_id == sg_message_id){
            if (event.event == 'delivered'){
                object = {
                    added_user_id: added_user.added_user_id,
                    notification_sendgrid_message_delivered: Date.now()
                }
            }
            else if (event.event == 'open'){
                object = {
                    added_user_id: added_user.added_user_id,
                    notification_sendgrid_message_opened: Date.now()
                }
            }
            else if (event.event == 'click'){
                object = {
                    added_user_id: added_user.added_user_id,
                    notification_sendgrid_message_clicked: Date.now()
                }
            }
            else if (event.event == 'bounce'){
                object = {
                    added_user_id: added_user.added_user_id,
                    notification_sendgrid_message_bounced: Date.now()
                }
            }
        }
        else if (added_user.reminder_one_sendgrid_message_id == sg_message_id){
            if (event.event == 'delivered'){
                object = {
                    added_user_id: added_user.added_user_id,
                    reminder_one_sendgrid_message_delivered: Date.now()
                }
            }
            else if (event.event == 'open'){
                object = {
                    added_user_id: added_user.added_user_id,
                    reminder_one_sendgrid_message_opened: Date.now()
                }
            }
            else if (event.event == 'click'){
                object = {
                    added_user_id: added_user.added_user_id,
                    reminder_one_sendgrid_message_clicked: Date.now()
                }
            }
            else if (event.event == 'bounce'){
                object = {
                    added_user_id: added_user.added_user_id,
                    reminder_one_sendgrid_message_bounced: Date.now()
                }
            }
        }
        else if (added_user.reminder_two_sendgrid_message_id == sg_message_id){
            if (event.event == 'delivered'){
                object = {
                    added_user_id: added_user.added_user_id,
                    reminder_two_sendgrid_message_delivered: Date.now()
                }
            }
            else if (event.event == 'open'){
                object = {
                    added_user_id: added_user.added_user_id,
                    reminder_two_sendgrid_message_opened: Date.now()
                }
            }
            else if (event.event == 'click'){
                object = {
                    added_user_id: added_user.added_user_id,
                    reminder_two_sendgrid_message_clicked: Date.now()
                }
            }
            else if (event.event == 'bounce'){
                object = {
                    added_user_id: added_user.added_user_id,
                    reminder_two_sendgrid_message_bounced: Date.now()
                }
            }
        }

        if (object) await this.apisRepository.updateAddedUser(object);

        }
        catch(err){
            console.log('error storing email notification - ', err);
        }

    /*
    tables.getByField('email_notifications', 'sendgrid_message_id', sg_message_id).then(function (data) {
        var record = data[0];

        //see if a record for that message id exists
        //var record = records.find(x => { return x.sendgrid_message_id == sg_message_id });

        //record already exists
        if (record) {
            if (event.event == 'delivered') {
                var object = {
                    email_notification_id: record.email_notification_id,
                    delivered: true,
                    delivered_timestamp: Date.now()
                }

                tables.updateItem('email_notifications', object, 'email_notification_id');

                //update vendor collection record
                //tables.updateCollectionRecord(record);

            }

            else if (event.event == 'open') {
                var object = {
                    email_notification_id: record.email_notification_id,
                    opened: true,
                    opened_timestamp: Date.now()
                }

                tables.updateItem('email_notifications', object, 'email_notification_id');
            }
        }

    })
    */
}

    public async mailing(){
        var added_users = await this.apisRepository.getAddedUsers();

        var emails:any[] = [];
        added_users.forEach((x:any) => {
            if (x.notification_sendgrid_message_id) emails.push({
                user_id: x.user_id,
                name: x.first_name + ' ' + x.last_name,
                personal_email: x.personal_email,
                message: 'Notification',
                delivered: x.notification_sendgrid_message_delivered ? true:false,
                opened: x.notification_sendgrid_message_opened ? true:false,
                clicked: x.notification_sendgrid_message_clicked ? true:false,
                bounced: x.notification_sendgrid_message_bounced ? true:false,
                delivered_date: x.notification_sendgrid_message_delivered ? this.commonService.getDate(x.notification_sendgrid_message_delivered):'',
                opened_date: x.notification_sendgrid_message_opened ? this.commonService.getDate(x.notification_sendgrid_message_opened):'',
                clicked_date: x.notification_sendgrid_message_clicked ? this.commonService.getDate(x.notification_sendgrid_message_clicked):'',
                bounced_date: x.notification_sendgrid_message_bounced ? this.commonService.getDate(x.notification_sendgrid_message_bounced):'',
                org_unit_path: x.org_unit_path
            });

            if(x.reminder_one_sendgrid_message_id) emails.push({
                user_id: x.user_id,
                name: x.first_name + ' ' + x.last_name,
                personal_email: x.personal_email,
                message: 'Reminder One',
                delivered: x.reminder_one_sendgrid_message_delivered ? true:false,
                opened: x.reminder_one_sendgrid_message_opened ? true:false,
                clicked: x.reminder_one_sendgrid_message_clicked ? true:false,
                bounced: x.reminder_one_sendgrid_message_bounced ? true:false,
                delivered_date: x.reminder_one_sendgrid_message_delivered ? this.commonService.getDate(x.reminder_one_sendgrid_message_delivered):'',
                opened_date: x.reminder_one_sendgrid_message_opened ? this.commonService.getDate(x.reminder_one_sendgrid_message_opened):'',
                clicked_date: x.reminder_one_sendgrid_message_clicked ? this.commonService.getDate(x.reminder_one_sendgrid_message_clicked):'',
                bounced_date: x.reminder_one_sendgrid_message_bounced ? this.commonService.getDate(x.reminder_one_sendgrid_message_bounced):'',
                org_unit_path: x.org_unit_path
            });

            if(x.reminder_two_sendgrid_message_id) emails.push({
                user_id: x.user_id,
                name: x.first_name + ' ' + x.last_name,
                personal_email: x.personal_email,
                message: 'Reminder Two',
                delivered: x.reminder_two_sendgrid_message_delivered ? true:false,
                opened: x.reminder_two_sendgrid_message_opened ? true:false,
                clicked: x.reminder_two_sendgrid_message_clicked ? true:false,
                bounced: x.reminder_two_sendgrid_message_bounced ? true:false,
                delivered_date: x.reminder_two_sendgrid_message_delivered ? this.commonService.getDate(x.reminder_two_sendgrid_message_delivered):'',
                opened_date: x.reminder_two_sendgrid_message_opened ? this.commonService.getDate(x.reminder_two_sendgrid_message_opened):'',
                clicked_date: x.reminder_two_sendgrid_message_clicked ? this.commonService.getDate(x.reminder_two_sendgrid_message_clicked):'',
                bounced_date: x.reminder_two_sendgrid_message_bounced ? this.commonService.getDate(x.reminder_two_sendgrid_message_bounced):'',
                org_unit_path: x.org_unit_path
            });
        });

        return emails;
    }

    public async getProductionAssignments(){
        var assignments = this.apisRepository.getProductionAssignments();
        return assignments;
    }

    public async getProductionsForExecutiveAdmin(admin_id:number){
        var all_productions = await this.getProductions();

        //get executive admin assignments
        var executive_admin_assignments = await this.apisRepository.getExecutiveAdminProductionAssignments(admin_id);
        var production_ids = executive_admin_assignments.map((x:any) => { return x.production_id});

        var productions = all_productions.filter((x:any) => { return production_ids.indexOf(x.production_id) > -1});

        //attach executive admin assignment
        productions.forEach((x:any) => {
            var recordx = executive_admin_assignments.find((n:any) => { return n.production_id == x.production_id; });
            if (recordx) x.exec_admin_production_assignment_id = recordx.exec_admin_production_assignment_id;
        });

        return productions;
    }

    public async getUsersForExecutiveAdmin(admin_id:number){

        //get admin record
        var adminx = await this.apisRepository.getAdmin(admin_id);
        var admin = adminx[0];
        console.log('--------', admin);

        //get admin production assignments
        var executive_admin_assignments = await this.apisRepository.getExecutiveAdminProductionAssignments(admin_id);
        var executive_admin_production_ids = executive_admin_assignments.map((x:any) => { return x.production_id; });

        var users = await this.apisRepository.getUsers();
        var assignments = (await this.apisRepository.getProductionAssignments()).filter((x:any) => { return executive_admin_production_ids.indexOf(x.production_id) > -1});
        var productions = (await this.apisRepository.getProductions()).filter((x:any) => { return executive_admin_production_ids.indexOf(x.production_id) > -1});

        //check assignments for each user
        users.forEach((user:any) => {
            var assignmentsx = assignments.filter((x:any) => { return x.user_id == user.user_id });
            
            var productionsx = [] as any[];
            assignmentsx.forEach((n:any) => {
                var production = productions.find((m:any) => { return m.production_id == n.production_id});
                //if (!production) console.log('production', production, n);
                production.assignment_status = n.status;
                //get start and end dates
                production.assignment_start_date = this.commonService.getDate(n.created_timestamp);
                production.assignment_end_date = this.commonService.getDate(n.ended_timestamp);
                productionsx.push(production);
            });

            user.productions = productionsx;
            user.last_login_date = this.commonService.getDate(user.last_login_time);
            user.creation_date = this.commonService.getDate(user.creation_time);
            user.usage_percentage = Math.round((user.total_used_mb/user.limit_mb)*100);
        });

        var usersx = users.filter((x:any) => { return x.productions.length > 0; });

        //console.log('users', users);

        return usersx;
    }

    public async getActivityForExecutiveAdmin(admin_id:number){

        //get admin record
        //var adminx = await this.apisRepository.getAdmin(admin_id);
        //var admin = adminx[0];
        
        //get admin production assignments
        var executive_admin_assignments = await this.apisRepository.getExecutiveAdminProductionAssignments(admin_id);
        var executive_admin_production_ids = executive_admin_assignments.map((x:any) => { return x.production_id; });

        var activity:any[] = [];
       for (let item of executive_admin_production_ids){
        var production = await this.getProductionDetails(item);
        
        //console.log('production', production);
        activity = activity.concat(production.activity);
       }

        //console.log('users', users);

        return activity;
    }

    public async addExecutiveAdminProductionAssignment(object:any){
        var executive_admin_production_assignment_id = await this.apisRepository.addExecutiveAdminProductionAssignment(object);
        return executive_admin_production_assignment_id;
    }

    public async deleteExecutiveAdminProductionAssignment(object:any){
        var executive_admin_production_assignment_id = await this.apisRepository.deleteExecutiveAdminProductionAssignment(object.exec_admin_production_assignment_id);
        return executive_admin_production_assignment_id;
    }

    public async getMailingForExecutiveAdmin(admin_id:number){

        //get admin record
        //var adminx = await this.apisRepository.getAdmin(admin_id);
        //var admin = adminx[0];
        var all_mailing = await this.apisRepository.getAddedUsers();
        
        //get admin production assignments
        var executive_admin_assignments = await this.apisRepository.getExecutiveAdminProductionAssignments(admin_id);
        var executive_admin_production_ids = executive_admin_assignments.map((x:any) => { return x.production_id; });

        var mailing:any[] = [];
       for (let item of executive_admin_production_ids){
        var production:any = await this.getProductionDetails(item);
        
        var mailingx = all_mailing.filter((x:any) => { return x.org_unit_path == production.org_unit_path});
        mailing = mailing.concat(mailingx);
        
       }

        //console.log('users', users);

        return mailing;
    }

    public async temp(){
        console.log('@temp');
        
        var users = await this.apisRepository.getUsers();
        console.log('users,', users.length);
        var assignments = await this.apisRepository.getProductionAssignments();
        console.log('assignments,', assignments.length);
        var report_actions = await this.apisRepository.getReportActions();
        var ctr = 0;

        for (let item of report_actions){
            //find user
            var record = users.find((x:any) => { return x.user_id == item.user_id });
            if (!record){
                ctr+=1;
                console.log('ctr', ctr);
                //delete assignment
                //await this.apisRepository.deleteReportAction(item.report_action_id);
            }
        }

        /*
        for (let user of users){
            var assignmentsx = assignments.filter((x:any) => { return x.user_id == user.user_id});
            //console.log('assignments.length',assignmentsx.length);
            //console.log('user',user);
            //console.log('assignmentx', assignmentsx);
            if (assignmentsx.length == 1){
                
                var assignment_object = {
                    production_assignment_id: assignmentsx[0].production_assignment_id,
                    created_timestamp: user.creation_time
                }

                //console.log('assignemnt_object', assignment_object);

                await this.apisRepository.updateProductionAssignment(assignment_object);
                console.log(ctr+=1);
            }
        }
        */
    }
    
}