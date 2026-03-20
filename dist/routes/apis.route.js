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
exports.ApisRoute = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const apis_controller_1 = require("../controllers/apis.controller");
let ApisRoute = class ApisRoute {
    constructor(apisController) {
        this.apisController = apisController;
        this.path = '/apis';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // We pass the function reference. Controller handles (req, res, next)
        this.router.get(`${this.path}/getProductions`, this.apisController.getProductions);
        this.router.get(`${this.path}/getProductionDetails`, this.apisController.getProductionDetails);
        this.router.get(`${this.path}/domainDetails`, this.apisController.getDomainDetails);
        this.router.get(`${this.path}/getUserDetails`, this.apisController.getUserDetails);
        this.router.get(`${this.path}/getDomainDetails`, this.apisController.getDomainDetails);
        this.router.get(`${this.path}/getUsers`, this.apisController.getUsers);
        this.router.get(`${this.path}/getAdmins`, this.apisController.getAdmins);
        //this.router.post(`${this.path}/addAdmin`, this.apisController.addAdmin);
        this.router.get(`${this.path}/getAdmin`, this.apisController.getAdmin);
        this.router.post(`${this.path}/updateAdmin`, this.apisController.updateAdmin);
        this.router.get(`${this.path}/getCoordinators`, this.apisController.getCoordinators);
        this.router.get(`${this.path}/getCoordinatorDetails`, this.apisController.getCoordinatorDetails);
        this.router.get(`${this.path}/getHealth`, this.apisController.getHealth);
        this.router.get(`${this.path}/getDuplicatedUsersByEmail`, this.apisController.getDuplicatedUsersByEmail);
        this.router.get(`${this.path}/getDuplicatedUsersByName`, this.apisController.getDuplicatedUsersByName);
        this.router.get(`${this.path}/getUnassignedUsers`, this.apisController.getUnassignedUsers);
        this.router.get(`${this.path}/getInactiveUsers`, this.apisController.getInactiveUsers);
        this.router.get(`${this.path}/getSimilarByEmail`, this.apisController.getSimilarByEmail);
        this.router.get(`${this.path}/getSimilarByName`, this.apisController.getSimilarByName);
        this.router.get(`${this.path}/getApproachingOneYear`, this.apisController.getApproachingOneYear);
    }
};
exports.ApisRoute = ApisRoute;
exports.ApisRoute = ApisRoute = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(apis_controller_1.ApisController)),
    __metadata("design:paramtypes", [apis_controller_1.ApisController])
], ApisRoute);
//# sourceMappingURL=apis.route.js.map