import { inject, singleton } from 'tsyringe';
import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
//import { User, type UserPersistenceData } from '@entities/user.entity';

export interface IApisRepository {
    //getConfiguration(): Promise<any>;
    getProductions(): Promise<any>;
    getProduction(production_id:number): Promise<any>;
    getProductionDetails(production_id:number): Promise<any>;
    updateProduction(production:any): Promise<any>;
    getProductionAssignments(): Promise<any>;

    getCoordinators(): Promise<any>;
    getCoordinator(coordinator_id:number): Promise<any>;
    getCoordinatorAssignments(): Promise<any>;
    getCoordinatorAssignment(coordinator_assignment_id:number): Promise<any>;
    addCoordinator(coordinator:any): Promise<any>;
    updateCoordinator(coordinator:any): Promise<any>;
    addCoordinatorAssignment(coordinator_assignment:any): Promise<any>;
    updateCoordinatorAssignment(coordinator_assignment:any): Promise<any>;
    getAssignmentsByCoordinatorId(coordinator_id:number): Promise<any>;

    getProductionCoordinators(production_id:number): Promise<any>;
    getProductionUsers(production_id:number): Promise<any>;
    getProductionUsersX(production_id:number): Promise<any>;
    getProductionActivity(production_id:number): Promise<any>;

    getUsers(): Promise<any>;
    getUser(user_id:number): Promise<any>;
    updateUser(user:any): Promise<any>;
    getUserDetails(user_id:number): Promise<any>;
    getUserAssignments(user_id:number): Promise<any>;
    addUser(user:any): Promise<any>;

    getAdmins(): Promise<any>;
    //addAdmin(admin:any): Promise<any>;
    updateAdmin(admin:any): Promise<any>;
    deleteAdmin(admin:any): Promise<any>;
    getAdmin(admin_id:number): Promise<any>;
    getAdminByEmail(email:string): Promise<any>;

    getReportActions(): Promise<any>;
    deleteReportAction(report_action_id:number): Promise <any>;

    getGoogleUsers(): Promise<any>;

    addProductionAssignment(production_assignment:any): Promise<any>;
    updateProductionAssignment(production_assignment:any): Promise<any>;
    getProductionAssignment(production_assignment_id:number): Promise<any>;
    deleteProductionAssignment(production_assignment_id:number): Promise <any>;

    getAddedUsers(): Promise<any>;
    getAddedUserByEmail(email:string): Promise<any>;
    updateAddedUser(user:any): Promise<any>;
    
    //addProduction(object: any): Promise<any>;
    //updateProduction(object: any): Promise<any>;
    //addProductionAssignment(object: any): Promise<any>;
    //findById(id: string): Promise<User | undefined>;
    //findByEmail(email: string): Promise<User | undefined>;
    //save(user: User): Promise<User>;
    //update(id: string, user: User): Promise<User | undefined>;
    //delete(id: string): Promise<boolean>;
    createBulkUploadRun(): Promise<any>;
    updateBulkUploadRun(object:any): Promise<any>;
    getBulkUploadRun(run_id:number): Promise<any>;

    addExecutiveAdminProductionAssignment(production_assignment:any): Promise<any>;
    getExecutiveAdminProductionAssignments(admin_id:number): Promise<any>;
    deleteExecutiveAdminProductionAssignment(exec_admin_production_assignment_id:number): Promise<any>;
    
    addMessagingGroup(group:any): Promise<any>;
    getMessagingGroups(admin_id:number): Promise<any>;
    deleteMessagingGroup(messaging_group_id:number): Promise<any>;
    updateMessagingGroup(group:any): Promise<any>;

    addComposedMessage(object:any): Promise<any>;
    addIndividualMessage(object:any): Promise<any>;
    getIndividualMessagesByEmail(email:string): Promise<any>;

    getComposedMessagesByAdmin(admin_id:number): Promise<any>;
    getComposedMessage(message_id:number): Promise<any>;
    getIndividualMessagesFromComposeMessage(message_id:number): Promise<any>;
}

@singleton()
export class ApisRepository implements IApisRepository {

    // We "Inject" the pool that was created elsewhere
    constructor(@inject('DbPool') private db: Pool) { }

    async getProductions(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM productions`
        );

        return result;
    }

    async getProduction(production_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM productions WHERE production_id=${production_id}`
        );

        return result;
    }

    async getProductionAssignments(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM production_assignments`
        );

        return result;
    }

    async getProductionDetails(production_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM productions WHERE production_id=${production_id}`
        );

        return result;
    }

    async updateProduction(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE productions SET ? WHERE production_id = ${object.production_id}`,
            [object]
        );

        return result;
    }

    async getCoordinators(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM coordinators`
        );

        return result;
    }

    async getCoordinatorAssignments(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM coordinator_assignments`
        );

        return result;
    }

    async getCoordinatorAssignment(coordinator_assignment_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM coordinator_assignments WHERE coordinator_assignment_id=${coordinator_assignment_id}`
        );

        return result;
    }

    async addCoordinator(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
            `INSERT coordinators SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }

    async updateCoordinator(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
             `UPDATE coordinators SET ? WHERE coordinator_id = ${object.coordinator_id}`,
            [object]
        );

        return result;
    }

    async addCoordinatorAssignment(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
            `INSERT coordinator_assignments SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }

    async updateCoordinatorAssignment(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE coordinator_assignments SET ? WHERE coordinator_assignment_id = ${object.coordinator_assignment_id}`,
            [object]
        );

        return result;
    }

    async getProductionCoordinators(production_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT coordinator_assignments.status AS coordinator_assignment_status,
            coordinators.* 
            FROM coordinator_assignments 
            LEFT JOIN coordinators ON coordinators.coordinator_id=coordinator_assignments.coordinator_id 
            WHERE coordinator_assignments.production_id=${production_id}`
        );

        return result;
    }

    async getProductionUsers(production_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT production_assignments.status AS assignment_status,
            users.* 
            FROM production_assignments 
            LEFT JOIN users ON users.user_id=production_assignments.user_id 
            WHERE production_assignments.production_id=${production_id} AND production_assignments.status='active'`
        );

        return result;
    }

    async getProductionUsersX(production_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT production_assignments.status AS assignment_status, production_assignments.created_timestamp AS assignment_created_timestamp, production_assignments.ended_timestamp AS assignment_ended_timestamp,
            users.* 
            FROM production_assignments 
            LEFT JOIN users ON users.user_id=production_assignments.user_id 
            WHERE production_assignments.production_id=${production_id}`
        );

        return result;
    }

    async getProductionActivity(production_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM report_actions WHERE production_id=${production_id}`
        );

        return result;
    }

    async getUserDetails(user_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM users WHERE user_id=${user_id}`
        );

        return result;
    }

    async getUserAssignments(user_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT 
            production_assignments.production_assignment_id, production_assignments.user_id, production_assignments.status AS assignment_status, 
            production_assignments.created_timestamp AS started_timestamp, production_assignments.ended_timestamp,
            productions.*
            FROM production_assignments 
            LEFT JOIN productions ON productions.production_id=production_assignments.production_id 
            WHERE production_assignments.user_id=${user_id}`
        );

        return result;
    }

    async getUsers(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM users`
        );

        return result;
    }

    async updateUser(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE users SET ? WHERE user_id = ${object.user_id}`,
            [object]
        );

        return result;
    }

    async getUser(user_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM users WHERE user_id=${user_id}`
        );

        return result;
    }

    async getAdmins(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT admin_id, first_name, last_name, email, role, created_timestamp, last_login, status FROM admins`
        );

        return result;
    }

    async getAdmin(admin_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT admin_id, first_name, last_name, email, role, production_id FROM admins WHERE admin_id=${admin_id}`
        );

        return result;
    }

    /*
    async addAdmin(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `INSERT admins SET ?`,
            [object]
        );

        return result;
    }
    */
    async updateAdmin(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE admins SET ? WHERE admin_id = ${object.admin_id}`,
            [object]
        );

        return result;
    }

    async deleteAdmin(admin_id:number): Promise<any> {
        //const data = user.toPersistence();

         const [result] = await this.db.query<RowDataPacket[]>(
            `DELETE FROM admins WHERE admin_id=${admin_id}`
        );

        return result;
    }

    async getAdminByEmail(email:string): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT admin_id FROM admins WHERE email='${email}'`
        );

        return result;
    }

    async getCoordinator(coordinator_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM coordinators WHERE coordinator_id=${coordinator_id}`
        );

        return result;
    }

    async getAssignmentsByCoordinatorId(coordinator_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT 
            coordinator_assignments.coordinator_assignment_id, coordinator_assignments.status AS assignment_status, 
            coordinator_assignments.created_timestamp AS assignment_created_timestamp, 
            coordinator_assignments.ended_timestamp AS assignment_ended_timestamp,
            coordinator_assignments.notes AS assignment_notes, 
            productions.*
            FROM coordinator_assignments 
            LEFT JOIN productions ON productions.production_id=coordinator_assignments.production_id 
            WHERE coordinator_assignments.coordinator_id=${coordinator_id}`
        );

        return result;
    }

    async getReportActions(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM report_actions ORDER BY timestamp DESC`
        );

        return result;
    }

    async deleteReportAction(report_action_id:number): Promise<any> {
        //const data = user.toPersistence();

         const [result] = await this.db.query<RowDataPacket[]>(
            `DELETE FROM report_actions WHERE report_action_id=${report_action_id}`
        );

        return result;
    }

    async getGoogleUsers(): Promise<any> {
        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM google_data_snapshots ORDER BY timestamp DESC LIMIT 1`
        );

        return result;
    }

    async addProductionAssignment(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
            `INSERT production_assignments SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }

    async updateProductionAssignment(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE production_assignments SET ? WHERE production_assignment_id = ${object.production_assignment_id}`,
            [object]
        );

        return result;
    }

    async deleteProductionAssignment(production_assignment_id:number): Promise<any> {
        //const data = user.toPersistence();

         const [result] = await this.db.query<RowDataPacket[]>(
            `DELETE FROM production_assignments WHERE production_assignment_id=${production_assignment_id}`
        );

        return result;
    }

    async getProductionAssignment(production_assignment_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM production_assignments WHERE production_assignment_id=${production_assignment_id}`
        );

        return result;
    }

    async getAddedUsers(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM added_users`
        );

        return result;
    }

    async updateAddedUser(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE added_users SET ? WHERE added_user_id = ${object.added_user_id}`,
            [object]
        );

        return result;
    }

    
    async getAddedUserByEmail(email:string): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM added_users WHERE personal_email='${email}'`
        );

        return result;
    }

    async createBulkUploadRun(): Promise<any> {
        //const data = user.toPersistence();
        var object = {
            status: 'Started...'
        }

        const [result] = await this.db.query<ResultSetHeader>(
            `INSERT bulk_upload_runs SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }

    async updateBulkUploadRun(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE bulk_upload_runs SET ? WHERE bulk_upload_run_id = ${object.bulk_upload_run_id}`,
            [object]
        );

        return result;
    }

    async getBulkUploadRun(run_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM bulk_upload_runs WHERE bulk_upload_run_id=${run_id}`
        );

        return result;
    }

    async addUser(object: any): Promise<any> {
        //const data = user.toPersistence();
        const [result] = await this.db.query<ResultSetHeader>(
            `INSERT users SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }

    async addExecutiveAdminProductionAssignment(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
            `INSERT exec_admins_production_assignments SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }

    async getExecutiveAdminProductionAssignments(admin_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM exec_admins_production_assignments WHERE admin_id=${admin_id}`
        );

        return result;
    }

    async deleteExecutiveAdminProductionAssignment(exec_admin_production_assignment_id:number): Promise<any> {
        //const data = user.toPersistence();

         const [result] = await this.db.query<RowDataPacket[]>(
            `DELETE FROM exec_admins_production_assignments WHERE exec_admin_production_assignment_id=${exec_admin_production_assignment_id}`
        );

        return result;
    }

    async addMessagingGroup(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
            `INSERT messaging_groups SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }

    async getMessagingGroups(admin_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM messaging_groups WHERE admin_id=${admin_id}`
        );

        return result;
    }

    async deleteMessagingGroup(messaging_group_id:number): Promise<any> {
        //const data = user.toPersistence();

         const [result] = await this.db.query<RowDataPacket[]>(
            `DELETE FROM messaging_groups WHERE messaging_group_id=${messaging_group_id}`
        );

        return result;
    }

    async updateMessagingGroup(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE messaging_groups SET ? WHERE messaging_group_id = ${object.messaging_group_id}`,
            [object]
        );

        return result;
    }

    async addComposedMessage(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
            `INSERT composed_messages SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }

    async addIndividualMessage(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
            `INSERT individual_messages SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }

    async getIndividualMessagesByEmail(email:string): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM individual_messages WHERE recipient_email='${email}'`
        );

        return result;
    }

    async getComposedMessagesByAdmin(admin_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM composed_messages WHERE admin_id='${admin_id}'`
        );

        return result;
    }

    async getComposedMessage(message_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM composed_messages WHERE composed_message_id='${message_id}'`
        );

        return result;
    }

    async getIndividualMessagesFromComposeMessage(message_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT 
            individual_messages.*, users.production_email, users.first_name, users.last_name 
            FROM individual_messages 
            LEFT JOIN users ON users.user_id=individual_messages.user_id
            WHERE composed_message_id='${message_id}'`
        );

        return result;
    }

}
