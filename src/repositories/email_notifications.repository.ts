import { inject, singleton } from 'tsyringe';
import { Pool } from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
//import { User, type UserPersistenceData } from '@entities/user.entity';

export interface IEmailNotificationsRepository {
  //getConfiguration(): Promise<any>;
  saveEmailNotification(object:any): Promise<any>;
  
}

@singleton()
export class EmailNotificationsRepository implements IEmailNotificationsRepository {

    // We "Inject" the pool that was created elsewhere
    constructor(@inject('DbPool') private db: Pool) { }

     async saveEmailNotification(object: any): Promise<any> {
        //const data = user.toPersistence();

        const [result] = await this.db.query<RowDataPacket[]>(
            `UPDATE added_users SET ? WHERE personal_email = '${object.personal_email}'`,
            [object]
        );

        return result;
    }

}