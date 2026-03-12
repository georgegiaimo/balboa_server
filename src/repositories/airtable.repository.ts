import { inject, singleton } from 'tsyringe';
import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
//import { User, type UserPersistenceData } from '@entities/user.entity';

export interface IAirtableRepository {
  //getConfiguration(): Promise<any>;
  addCoordinator(object:any): Promise<any>;
  getCoordinators(): Promise<any>;
  addProduction(object:any): Promise<any>;
  addCoordinatorAssignment(object:any): Promise<any>;
 
  getUsers(): Promise<any>;
    addUser(object:any): Promise<any>;
    updateUser(object:any): Promise<any>;
  //findById(id: string): Promise<User | undefined>;
  //findByEmail(email: string): Promise<User | undefined>;
  //save(user: User): Promise<User>;
  //update(id: string, user: User): Promise<User | undefined>;
  //delete(id: string): Promise<boolean>;
}

@singleton()
export class AirtableRepository implements IAirtableRepository {

    // We "Inject" the pool that was created elsewhere
    constructor(@inject('DbPool') private db: Pool) { }

    /*
    async getConfiguration(): Promise<RowDataPacket[]> {

        const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM ai_configuration');
        return rows;
    }
    */

    async addCoordinator(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `INSERT coordinators SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.affectedRows : undefined;
    }

    async getCoordinators(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM coordinators`
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

    async addCoordinatorAssignment(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `INSERT coordinator_assignments SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;
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

    async getUsers(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM users`
        );

        return result;
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
}
 