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
exports.SystemController = void 0;
const tsyringe_1 = require("tsyringe");
const system_service_1 = require("../services/system.service");
let SystemController = class SystemController {
    constructor(systemService) {
        this.systemService = systemService;
        this.getConfiguration = async (req, res, next) => {
            try {
                // Controller calls the service
                const result = await this.systemService.getConfiguration();
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
        this.updateConfiguration = async (req, res, next) => {
            try {
                const { contents } = req.body;
                console.log('contents', contents);
                console.log('req.body', req.body);
                // Controller handles basic validation
                if (!contents)
                    return res.status(400).json({ message: 'Data is required' });
                // Controller calls the service
                const result = await this.systemService.updateConfiguration(contents);
                // Controller sends the final response
                res.status(200).json({ data: result, message: 'success' });
            }
            catch (error) {
                next(error); // Pass to global error handler
            }
        };
    }
};
exports.SystemController = SystemController;
exports.SystemController = SystemController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(system_service_1.SystemService)),
    __metadata("design:paramtypes", [system_service_1.SystemService])
], SystemController);
//# sourceMappingURL=system.controller.js.map