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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const common_service_1 = require("./common.service");
const tsyringe_1 = require("tsyringe");
let SendGridService = class SendGridService {
    constructor(commonService) {
        this.commonService = commonService;
        const apiKey = process.env.SENDGRID_API_KEY;
        if (apiKey) {
            mail_1.default.setApiKey(apiKey);
        }
        else {
            console.warn('SendGrid API Key is missing. Emails will not be sent.');
        }
    }
    async notificationOfAdminInvitation(data) {
        var link;
        if (process.env.ENVIRONMENT == 'development')
            link = 'http://localhost:4200/password-reset/' + data.password_reset_token;
        else
            link = 'https://askbalboa.com/password-reset/' + data.password_reset_token;
        var mailObj = {
            to: data.email,
            from: {
                email: "admin@askbalboa.com",
                name: "Balboa Computer"
            },
            templateId: "d-065b37506b1f4a7b9427dc8d78d2025b",
            dynamic_template_data: {
                name: data.first_name,
                link_url: link
            }
        };
        this.sendEmail(mailObj);
    }
    async resetPassword(data) {
        var link;
        if (process.env.ENVIRONMENT == 'development')
            link = 'http://localhost:4200/password-reset/' + data.password_reset_token;
        else
            link = 'https://askbalboa.com/password-reset/' + data.password_reset_token;
        var mailObj = {
            to: data.email,
            from: {
                email: "admin@askbalboa.com",
                name: "Balboa Computer"
            },
            templateId: "d-8a3c2f6ed31b4578843440a39ba71858",
            dynamic_template_data: {
                link_url: link
            }
        };
        this.sendEmail(mailObj);
    }
    async sendEmail(msg) {
        try {
            await mail_1.default.send(msg);
            console.log(`[Email Success]: Sent to ${msg.to}`);
            return { success: true };
        }
        catch (error) {
            console.error('[Email Error]:', error.response?.body || error.message);
            throw new Error('Failed to send email notification');
        }
    }
};
exports.SendGridService = SendGridService;
exports.SendGridService = SendGridService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(common_service_1.CommonService)),
    __metadata("design:paramtypes", [common_service_1.CommonService])
], SendGridService);
//# sourceMappingURL=sendgrid.service.js.map