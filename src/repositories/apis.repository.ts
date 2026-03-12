import { inject, singleton } from 'tsyringe';
import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
//import { User, type UserPersistenceData } from '@entities/user.entity';

export interface IApisRepository {
    //getConfiguration(): Promise<any>;
    getProductions(): Promise<any>;
    getProductionDetails(production_id:number): Promise<any>;
    getProductionAssignments(): Promise<any>;

    getCoordinators(): Promise<any>;
    getCoordinatorAssignments(): Promise<any>;

    getProductionCoordinators(production_id:number): Promise<any>;
    getProductionUsers(production_id:number): Promise<any>;

    getUsers(): Promise<any>;
    getUserDetails(user_id:number): Promise<any>;
    getUserAssignments(user_id:number): Promise<any>;

    getAdmins(): Promise<any>;
    addAdmin(admin:any): Promise<any>;
    updateAdmin(admin:any): Promise<any>;
    getAdmin(admin_id:number): Promise<any>;

    //addProduction(object: any): Promise<any>;
    //updateProduction(object: any): Promise<any>;
    //addProductionAssignment(object: any): Promise<any>;
    //findById(id: string): Promise<User | undefined>;
    //findByEmail(email: string): Promise<User | undefined>;
    //save(user: User): Promise<User>;
    //update(id: string, user: User): Promise<User | undefined>;
    //delete(id: string): Promise<boolean>;
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
            WHERE production_assignments.production_id=${production_id}`
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
            production_assignments.status AS assignment_status,
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

    async getAdmins(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT admin_id, first_name, last_name, email, role, created_timestamp, last_login FROM admins`
        );

        return result;
    }

    async getAdmin(admin_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT admin_id, first_name, last_name, email, role FROM admins WHERE admin_id=${admin_id}`
        );

        return result;
    }

    async addAdmin(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `INSERT admins SET ?`,
            [object]
        );

        return result;
    }

    async updateAdmin(object:any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE admins SET ? WHERE user_id = ${object.user_id}`,
            [object]
        );

        return result;
    }


}
