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
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
const auth_service_1 = require("../services/auth.service");
const asyncHandler_1 = require("../utils/asyncHandler");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signUp = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const userData = req.body;
            const signUpUserData = await this.authService.signup(userData);
            res.status(201).json({ data: signUpUserData, message: 'signup' });
        });
        this.logIn = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const loginData = req.body;
            const { cookie, user } = await this.authService.login(loginData);
            res.setHeader('Set-Cookie', [cookie]);
            res.status(200).json({ data: user, message: 'login' });
        });
        this.getAdminFromToken = async (req, res, next) => {
            try {
                var token = req.query.token;
                // Controller calls the service
                const result = await this.authService.getAdminFromToken(token);
                // Controller sends the final response
                if (result)
                    res.status(200).json({ data: result, message: 'success' });
                else
                    res.status(200).json({ data: result, error: 'token is invalid or expired' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.resetPassword = async (req, res, next) => {
            try {
                var user_data = req.body;
                // Controller calls the service
                const result = await this.authService.resetPassword(user_data);
                // Controller sends the final response
                if (result)
                    res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.logOut = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const userReq = req;
            const user = userReq.user;
            await this.authService.logout(user);
            res.clearCookie('Authorization', {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                // secure: true, // 프로덕션에서 HTTPS일 때만
            });
            res.status(200).json({ message: 'logout' });
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map