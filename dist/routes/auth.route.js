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
exports.AuthRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const auth_controller_1 = require("../controllers/auth.controller");
let AuthRoute = class AuthRoute {
    constructor(authController) {
        this.authController = authController;
        this.router = (0, express_1.Router)();
        this.path = '/auth';
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/signup`, this.authController.signUp);
        this.router.post(`${this.path}/logIn`, this.authController.logIn);
        this.router.get(`${this.path}/getAdminFromToken`, this.authController.getAdminFromToken);
        this.router.post(`${this.path}/resetPassword`, this.authController.resetPassword);
        this.router.post(`${this.path}/sendResetLink`, this.authController.sendResetLink);
    }
};
exports.AuthRoute = AuthRoute;
exports.AuthRoute = AuthRoute = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(auth_controller_1.AuthController)),
    __metadata("design:paramtypes", [auth_controller_1.AuthController])
], AuthRoute);
//# sourceMappingURL=auth.route.js.map