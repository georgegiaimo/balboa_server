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
exports.ApisController = void 0;
const tsyringe_1 = require("tsyringe");
const apis_service_1 = require("../services/apis.service");
let ApisController = class ApisController {
    constructor(apisService) {
        this.apisService = apisService;
        this.getProductions = async (req, res, next) => {
            try {
                // Controller calls the service
                const result = await this.apisService.getProductions();
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.getProductionDetails = async (req, res, next) => {
            try {
                var production_id = Number(req.query.id);
                // Controller calls the service
                const result = await this.apisService.getProductionDetails(production_id);
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.getUserDetails = async (req, res, next) => {
            try {
                var user_id = Number(req.query.id);
                // Controller calls the service
                const result = await this.apisService.getUserDetails(user_id);
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.getUsers = async (req, res, next) => {
            try {
                // Controller calls the service
                const result = await this.apisService.getUsers();
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.getDomainDetails = async (req, res, next) => {
            try {
                var domain = req.query.domain;
                // Controller calls the service
                const result = await this.apisService.getDomainDetails(domain);
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.getAdmins = async (req, res, next) => {
            try {
                // Controller calls the service
                const result = await this.apisService.getAdmins();
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.addAdmin = async (req, res, next) => {
            try {
                const { first_name, last_name, email, role } = req.body;
                // Controller handles basic validation
                if (!first_name)
                    return res.status(400).json({ message: 'First name is required' });
                else if (!last_name)
                    return res.status(400).json({ message: 'Last name is required' });
                else if (!email)
                    return res.status(400).json({ message: 'Email is required' });
                else if (!role)
                    return res.status(400).json({ message: 'Role is required' });
                // Controller calls the service
                const result = await this.apisService.addAdmin(first_name, last_name, email, role);
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.getAdmin = async (req, res, next) => {
            try {
                const admin_id = req.query.id;
                // 2. Optional: Basic validation
                if (!admin_id) {
                    return res.status(400).json({ message: 'ID query parameter is required' });
                }
                // Controller calls the service
                const result = await this.apisService.getAdmin(Number(admin_id));
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.updateAdmin = async (req, res, next) => {
            try {
                const data = req.body;
                // Controller calls the service
                const result = await this.apisService.updateAdmin(data);
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.getCoordinators = async (req, res, next) => {
            try {
                // Controller calls the service
                const result = await this.apisService.getCoordinators();
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
    }
};
exports.ApisController = ApisController;
exports.ApisController = ApisController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(apis_service_1.ApisService)),
    __metadata("design:paramtypes", [apis_service_1.ApisService])
], ApisController);
//# sourceMappingURL=apis.controller.js.map