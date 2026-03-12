import { inject, singleton } from 'tsyringe';
import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
//import { User, type UserPersistenceData } from '@entities/user.entity';

export interface ISystemRepository {
  getConfiguration(): Promise<any>;
  updateConfiguration(object:any): Promise<any>;
  //findById(id: string): Promise<User | undefined>;
  //findByEmail(email: string): Promise<User | undefined>;
  //save(user: User): Promise<User>;
  //update(id: string, user: User): Promise<User | undefined>;
  //delete(id: string): Promise<boolean>;
}

@singleton()
export class SystemRepository implements ISystemRepository {

    // We "Inject" the pool that was created elsewhere
    constructor(@inject('DbPool') private db: Pool) { }

    async getConfiguration(): Promise<RowDataPacket[]> {

        const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM ai_configuration');
        return rows;
    }

    async updateConfiguration(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<ResultSetHeader>(
            `UPDATE ai_configuration SET ? WHERE id = ${object.id}`,
            [object, object.id]
        );

        const header = result as ResultSetHeader;
        return header.affectedRows > 0 ? header.affectedRows : undefined;
    }
}
 