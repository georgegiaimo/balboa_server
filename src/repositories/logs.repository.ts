import { inject, singleton } from 'tsyringe';
import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
//import { User, type UserPersistenceData } from '@entities/user.entity';

export interface ILogsRepository {
    //getConfiguration(): Promise<any>;
    getUserLogs(): Promise<any>;
    writeToLogs(object:any): Promise<any>;
    
}

@singleton()
export class LogsRepository implements ILogsRepository {

    // We "Inject" the pool that was created elsewhere
    constructor(@inject('DbPool') private db: Pool) { }

    /*
    async getConfiguration(): Promise<RowDataPacket[]> {

        const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM ai_configuration');
        return rows;
    }
    */

    async getUserLogs(): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `SELECT user_logs.*, admins.* 
            FROM user_logs 
            LEFT JOIN admins ON admins.admin_id=user_logs.admin_id`
        );

        return result;
    }


    async writeToLogs(object: any): Promise<any> {
        //const data = user.toPersistence();
         const [result] = await this.db.query<ResultSetHeader>(
            `INSERT user_logs SET ?`,
            [object]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.insertId : undefined;

    }
    


}
