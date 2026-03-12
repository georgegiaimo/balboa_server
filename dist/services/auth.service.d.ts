import { User, type UserCreateData } from '../entities/user.entity';
import type { IUsersRepository } from '../repositories/users.repository';
export declare class AuthService {
    private usersRepository;
    constructor(usersRepository: IUsersRepository);
    private createToken;
    private createCookie;
    signup(userData: UserCreateData): Promise<User>;
    login(loginData: {
        email: string;
        password: string;
    }): Promise<{
        cookie: string;
        user: User;
    }>;
    logout(user: User): Promise<void>;
}
