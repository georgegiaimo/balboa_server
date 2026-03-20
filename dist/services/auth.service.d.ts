import { User } from '../entities/user.entity';
import type { IUsersRepository } from '../repositories/users.repository';
import { SendGridService } from './sendgrid.service';
import { CommonService } from './common.service';
export declare class AuthService {
    private usersRepository;
    sendgridService: SendGridService;
    commonService: CommonService;
    constructor(usersRepository: IUsersRepository, sendgridService: SendGridService, commonService: CommonService);
    private createToken;
    private createCookie;
    signup(user_data: any): Promise<User>;
    login(loginData: {
        email: string;
        password: string;
    }): Promise<{
        cookie: string;
        user: User;
    }>;
    logout(user: any): Promise<void>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    hashPassword(password: string, saltRounds?: number): Promise<string>;
    getAdminFromToken(token: string): Promise<any>;
    resetPassword(data: any): Promise<any>;
    sendResetLink(data: any): Promise<true | undefined>;
}
