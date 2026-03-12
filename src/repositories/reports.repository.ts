import { inject, singleton } from 'tsyringe';
import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
//import { User, type UserPersistenceData } from '@entities/user.entity';

export interface IReportsRepository {
    //getConfiguration(): Promise<any>;
    getUsers(): Promise<any>;
    getProductions(): Promise<any>;
    getProductionAssignments(): Promise<any>;
    getHistoricalData(): Promise<any>;
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
export class ReportsRepository implements IReportsRepository {

    // We "Inject" the pool that was created elsewhere
    constructor(@inject('DbPool') private db: Pool) { }

    /*
    async getConfiguration(): Promise<RowDataPacket[]> {

        const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM ai_configuration');
        return rows;
    }
    */

    async getUsers(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM users`
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

    async getProductions(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM productions`
        );

        return result;
    }

    async getHistoricalData(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT * FROM historical_data`
        );

        return result;
    }

    


}
