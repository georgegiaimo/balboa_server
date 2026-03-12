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
exports.UsersController = void 0;
const tsyringe_1 = require("tsyringe");
const users_service_1 = require("../services/users.service");
const asyncHandler_1 = require("../utils/asyncHandler");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
        this.getUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const users = await this.userService.getAllUsers();
            const userResponses = users.map((user) => user.toResponse());
            res.json({ data: userResponses, message: 'findAll' });
        });
        this.getUserById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            res.json({ data: user.toResponse(), message: 'findById' });
        });
        this.createUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const userData = req.body;
            const user = await this.userService.createUser(userData);
            res.status(201).json({ data: user.toResponse(), message: 'create' });
        });
        this.updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.id;
            const updateData = req.body;
            const user = await this.userService.updateUser(userId, updateData);
            res.json({ data: user.toResponse(), message: 'update' });
        });
        this.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.id;
            await this.userService.deleteUser(userId);
            res.status(204).json({ message: 'delete' });
        });
    }
};
exports.UsersController = UsersController;
exports.UsersController = UsersController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map