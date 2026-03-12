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
exports.SystemRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const system_controller_1 = require("../controllers/system.controller");
let SystemRoute = class SystemRoute {
    constructor(systemController) {
        this.systemController = systemController;
        this.path = '/system';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // We pass the function reference. Controller handles (req, res, next)
        this.router.get(`${this.path}/getConfiguration`, this.systemController.getConfiguration);
        this.router.post(`${this.path}/updateConfiguration`, this.systemController.updateConfiguration);
    }
};
exports.SystemRoute = SystemRoute;
exports.SystemRoute = SystemRoute = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(system_controller_1.SystemController)),
    __metadata("design:paramtypes", [system_controller_1.SystemController])
], SystemRoute);
//# sourceMappingURL=system.route.js.map