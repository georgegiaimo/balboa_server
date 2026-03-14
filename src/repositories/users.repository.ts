import { inject, singleton } from 'tsyringe';
import { User, type UserPersistenceData } from '@entities/user.entity';
import { Pool, RowDataPacket } from 'mysql2/promise';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByToken(token: string): Promise<any>;
  save(user: any): Promise<any>;
  updateUser(user:any): Promise<any>;
  delete(id: string): Promise<boolean>;
}

@singleton()
export class UsersRepository implements IUsersRepository {

  constructor(
    @inject('DbPool') private db: Pool
  ){}

  private users: UserPersistenceData[] = [];

  async findAll(): Promise<User[]> {
    return this.users.map((userData) => User.fromPersistence(userData));
  }

  async findById(user_id: string): Promise<any> {
    //const userData = this.users.find((u) => u.user_id === id);
    //return userData ? User.fromPersistence(userData) : undefined;
  }

  async findByEmail(email: string): Promise<any> {

    /*
    const userData = this.users.find((u) => u.email === email.toLowerCase());
    return userData ? User.fromPersistence(userData) : undefined;
    */
    const [result] = await this.db.query<RowDataPacket[]>(
      `SELECT * FROM admins WHERE email='${email.toLowerCase()}'`
    );

    return result;

  }

  async save(object: any): Promise<any> {
    //const persistenceData = user.toPersistence();
    //this.users.push(persistenceData);
    const [result] = await this.db.query<RowDataPacket[]>(
      `INSERT admins SET ?`,
      [object]
    );

    return result;
  }

 
  async updateUser(object: any): Promise<any> {
    //const data = user.toPersistence();

    const [result] = await this.db.query<RowDataPacket[]>(
      `UPDATE admins SET ? WHERE admin_id = ${object.admin_id}`,
      [object]
    );

    return result;
  }
 

  async delete(id: string): Promise<boolean> {
    //const idx = this.users.findIndex((u) => u.user_id === id);
    //if (idx === -1) return false;
    //this.users.splice(idx, 1);
    return true;
  }

  async findByToken(token: string): Promise<any> {

    /*
    const userData = this.users.find((u) => u.email === email.toLowerCase());
    return userData ? User.fromPersistence(userData) : undefined;
    */
    const [result] = await this.db.query<RowDataPacket[]>(
      `SELECT admin_id FROM admins WHERE password_reset_token='${token}'`
    );

    console.log(token, result);
    return result;

  }

  reset() {
    this.users = [];
  }
}
