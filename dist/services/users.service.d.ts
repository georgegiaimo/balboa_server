import { User, type UserCreateData } from '../entities/user.entity';
import type { IUsersRepository } from '../repositories/users.repository';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: IUsersRepository);
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    createUser(userData: UserCreateData): Promise<User>;
    updateUser(id: string, updateData: {
        email?: string;
        password?: string;
    }): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
