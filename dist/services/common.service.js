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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const tsyringe_1 = require("tsyringe");
let CommonService = class CommonService {
    constructor() {
        this.getDate = (epoch) => {
            if (!epoch)
                return '-';
            // Heuristic: If the number is too small (e.g., 10 digits), 
            // it's likely seconds. JS Date needs milliseconds (13 digits).
            const timestamp = epoch < 10000000000 ? epoch * 1000 : epoch;
            const date = new Date(timestamp);
            // Extract components
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${month}-${day}-${year}`;
        };
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], CommonService);
//# sourceMappingURL=common.service.js.map