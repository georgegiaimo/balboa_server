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
exports.UsersRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const users_controller_1 = require("../controllers/users.controller");
const users_dto_1 = require("../dtos/users.dto");
const validation_middleware_1 = require("../middlewares/validation.middleware");
let UsersRoute = class UsersRoute {
    constructor(userController) {
        this.userController = userController;
        this.router = (0, express_1.Router)();
        this.path = '/users';
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.userController.getUsers);
        this.router.get(`${this.path}/:id`, this.userController.getUserById);
        this.router.post(this.path, (0, validation_middleware_1.ValidationMiddleware)(users_dto_1.createUserSchema), this.userController.createUser);
        this.router.put(`${this.path}/:id`, (0, validation_middleware_1.ValidationMiddleware)(users_dto_1.updateUserSchema), this.userController.updateUser);
        this.router.delete(`${this.path}/:id`, this.userController.deleteUser);
    }
};
exports.UsersRoute = UsersRoute;
exports.UsersRoute = UsersRoute = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(users_controller_1.UsersController)),
    __metadata("design:paramtypes", [users_controller_1.UsersController])
], UsersRoute);
//# sourceMappingURL=users.route.js.map