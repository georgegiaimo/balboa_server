"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const tsyringe_1 = require("tsyringe");
const env_1 = require("../config/env");
const httpException_1 = require("../exceptions/httpException");
const users_repository_1 = require("../repositories/users.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendgrid_service_1 = require("./sendgrid.service");
const common_service_1 = require("./common.service");
let AuthService = class AuthService {
    constructor(usersRepository, sendgridService, commonService) {
        this.usersRepository = usersRepository;
        this.sendgridService = sendgridService;
        this.commonService = commonService;
    }
    createToken(user) {
        if (!env_1.SECRET_KEY)
            throw new Error('SECRET_KEY is not defined');
        if (user.admin_id === undefined) {
            throw new Error('Admin id is undefined');
        }
        const dataStoredInToken = { user_id: user.user_id };
        const expiresIn = 60 * 60; // 1h
        const token = (0, jsonwebtoken_1.sign)(dataStoredInToken, env_1.SECRET_KEY, { expiresIn });
        return { expiresIn, token };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; SameSite=Lax;${env_1.NODE_ENV === 'production' ? ' Secure;' : ''}`;
    }
    async signup(user_data) {
        var userx = await this.usersRepository.findByEmail(user_data.email);
        var user = userx[0];
        if (user)
            throw new httpException_1.HttpException(409, `Email is already in use`);
        var token = this.commonService.createToken();
        var hashed_password = await this.hashPassword(user_data.password);
        //const newUser = await User.create(userData);
        var user_object = {
            first_name: user_data.first_name,
            last_name: user_data.last_name,
            email: user_data.email,
            role: user_data.role,
            created_timestamp: Date.now(),
            password: hashed_password,
            status: user_data.status,
            password_reset_token: token,
            password_reset_token_expiration: Date.now() + (1000 * 60 * 60 * 24 * 3)
        };
        var response = await this.usersRepository.save(user_object);
        //send notification email
        await this.sendgridService.notificationOfAdminInvitation(user_object);
        return response;
    }
    async login(loginData) {
        var userx = await this.usersRepository.findByEmail(loginData.email);
        var user = userx[0];
        console.log('userx', userx);
        if (!user)
            throw new httpException_1.HttpException(401, `Invalid email or password.`);
        const isPasswordMatching = await this.comparePassword(loginData.password, user.password);
        if (!isPasswordMatching)
            throw new httpException_1.HttpException(401, 'Password is incorrect');
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        //update user last login
        var object = {
            admin_id: user.admin_id,
            last_login: Date.now()
        };
        await this.usersRepository.updateUser(object);
        return { cookie, user: user };
    }
    async logout(user) {
        console.log(`User with email ${user.email} logged out.`);
        return;
    }
    async comparePassword(password, hash) {
        try {
            return await bcrypt_1.default.compare(password, hash);
        }
        catch (error) {
            console.error('Error comparing password:', error);
            return false;
        }
    }
    ;
    async hashPassword(password, saltRounds = 10) {
        try {
            // Generate a salt and hash the password in one step
            const hashed = await bcrypt_1.default.hash(password, saltRounds);
            return hashed;
        }
        catch (error) {
            console.error('Error hashing password:', error);
            throw new Error('Encryption failed');
        }
    }
    ;
    async getAdminFromToken(token) {
        console.log('token = ', token);
        var userx = await this.usersRepository.findByToken(token);
        var user = userx[0];
        console.log('userx', userx);
        return user;
    }
    async resetPassword(data) {
        console.log('reset password', data);
        //save hashed password
        var password_hashed = await this.hashPassword(data.password);
        var object = {
            admin_id: data.admin_id,
            password: password_hashed
        };
        var response = await this.usersRepository.updateUser(object);
        return response;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(users_repository_1.UsersRepository)),
    __param(1, (0, tsyringe_1.inject)(sendgrid_service_1.SendGridService)),
    __param(2, (0, tsyringe_1.inject)(common_service_1.CommonService)),
    __metadata("design:paramtypes", [Object, sendgrid_service_1.SendGridService,
        common_service_1.CommonService])
], AuthService);
//# sourceMappingURL=auth.service.js.map