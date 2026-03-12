import { User } from '../entities/user.entity';
export interface IUsersRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    save(user: User): Promise<User>;
    update(id: string, user: User): Promise<User | undefined>;
    delete(id: string): Promise<boolean>;
}
export declare class UsersRepository implements IUsersRepository {
    private users;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    save(user: User): Promise<User>;
    update(id: string, user: User): Promise<User | undefined>;
    delete(id: string): Promise<boolean>;
    reset(): void;
}
