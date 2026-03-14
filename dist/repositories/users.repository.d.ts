import { User } from '../entities/user.entity';
import { Pool } from 'mysql2/promise';
export interface IUsersRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    findByToken(token: string): Promise<any>;
    save(user: any): Promise<any>;
    updateUser(user: any): Promise<any>;
    delete(id: string): Promise<boolean>;
}
export declare class UsersRepository implements IUsersRepository {
    private db;
    constructor(db: Pool);
    private users;
    findAll(): Promise<User[]>;
    findById(user_id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    save(object: any): Promise<any>;
    updateUser(object: any): Promise<any>;
    delete(id: string): Promise<boolean>;
    findByToken(token: string): Promise<any>;
    reset(): void;
}
