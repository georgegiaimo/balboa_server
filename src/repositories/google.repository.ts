import { inject, singleton } from 'tsyringe';
import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
//import { User, type UserPersistenceData } from '@entities/user.entity';

export interface IGoogleRepository {
  //getConfiguration(): Promise<any>;
  addUser(object:any): Promise<any>;
 getUsers(): Promise<any>;
 updateUser(object:any): Promise<any>;
 getProductions(): Promise<any>;

  addProduction(object:any): Promise<any>;
    updateProduction(object:any): Promise<any>;
    addProductionAssignment(object:any): Promise<any>;
    getUserAssignments(id:number): Promise<any>;
    updateProductionAssignment(object:any): Promise<any>;
    addHistoricalData(object:any): Promise<any>;

    getProductionAssignments(): Promise<any>;
    deleteProductionAssignment(id:number): Promise<any>;
  //findById(id: string): Promise<User | undefined>;
  //findByEmail(email: string): Promise<User | undefined>;
  //save(user: User): Promise<User>;
  //update(id: string, user: User): Promise<User | undefined>;
  //delete(id: string): Promise<boolean>;
}

@singleton()
export class GoogleRepository implements IGoogleRepository {

    // We "Inject" the pool that was created elsewhere
    constructor(@inject('DbPool') private db: Pool) { }

    /*
    async getConfiguration(): Promise<RowDataPacket[]> {

        const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM ai_configuration');
        return rows;
    }
    */

    async addUser(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `INSERT users SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.affectedRows : undefined;
    }

    async getUsers(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM users`
        );

        return result;
    }

    async getProductions(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM productions`
        );

        return result;
    }

    async addProduction(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `INSERT productions SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }

    async updateProduction(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `UPDATE productions SET ? WHERE production_id = ${object.production_id}`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;
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

    async getUserAssignments(user_id:number): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT 
            production_assignments.production_assignment_id, production_assignments.status AS assignment_status,
            productions.*
            FROM production_assignments 
            LEFT JOIN productions ON productions.production_id=production_assignments.production_id 
            WHERE production_assignments.user_id=${user_id}`
        );

        return result;
    }

    async updateProductionAssignment(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `UPDATE production_assignments SET ? WHERE production_assignment_id = ${object.production_assignment_id}`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }

    async updateUser(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `UPDATE users SET ? WHERE user_id = ${object.user_id}`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }

    async addHistoricalData(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `INSERT historical_data SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;
    }

    async getProductionAssignments(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM production_assignments`
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

    
}
 