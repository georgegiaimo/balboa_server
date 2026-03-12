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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const tsyringe_1 = require("tsyringe");
const env_1 = require("../config/env");
const httpException_1 = require("../exceptions/httpException");
const user_entity_1 = require("../entities/user.entity");
const users_repository_1 = require("../repositories/users.repository");
let AuthService = class AuthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    createToken(user) {
        if (!env_1.SECRET_KEY)
            throw new Error('SECRET_KEY is not defined');
        if (user.id === undefined) {
            throw new Error('User id is undefined');
        }
        const dataStoredInToken = { id: user.id };
        const expiresIn = 60 * 60; // 1h
        const token = (0, jsonwebtoken_1.sign)(dataStoredInToken, env_1.SECRET_KEY, { expiresIn });
        return { expiresIn, token };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; SameSite=Lax;${env_1.NODE_ENV === 'production' ? ' Secure;' : ''}`;
    }
    async signup(userData) {
        const findUser = await this.usersRepository.findByEmail(userData.email);
        if (findUser)
            throw new httpException_1.HttpException(409, `Email is already in use`);
        // Entity 클래스의 팩토리 메서드로 생성 (모든 검증이 자동 처리됨)
        const newUser = await user_entity_1.User.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }
    async login(loginData) {
        const findUser = await this.usersRepository.findByEmail(loginData.email);
        if (!findUser)
            throw new httpException_1.HttpException(401, `Invalid email or password.`);
        // Entity의 도메인 메서드로 패스워드 검증
        const isPasswordMatching = await findUser.verifyPassword(loginData.password);
        if (!isPasswordMatching)
            throw new httpException_1.HttpException(401, 'Password is incorrect');
        const tokenData = this.createToken(findUser);
        const cookie = this.createCookie(tokenData);
        return { cookie, user: findUser };
    }
    async logout(user) {
        // 로그아웃은 실제 서비스에서는 서버에서 세션/리프레시토큰을 블랙리스트 처리 등 구현 가능
        // 여기서는 클라이언트의 쿠키를 삭제하면 충분
        console.log(`User with email ${user.email} logged out.`);
        return;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(users_repository_1.UsersRepository)),
    __metadata("design:paramtypes", [Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map