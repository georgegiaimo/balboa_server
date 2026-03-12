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
exports.ChatService = void 0;
const tsyringe_1 = require("tsyringe");
//import { ChatRepository } from '@repositories/chat.repository';
const genai_1 = require("@google/genai");
const _config_1 = require("../config/env.js");
const system_service_1 = require("./system.service");
let ChatService = class ChatService {
    //constructor(@inject(ChatRepository) private chatRepo: ChatRepository) {}
    constructor(systemService) {
        this.systemService = systemService;
        this.client = new genai_1.GoogleGenAI({ apiKey: _config_1.GEMINI_API_KEY });
    }
    async processUserMessage(userId, message, contents) {
        const configx = await this.systemService.getConfiguration();
        //console.log('config', config);
        const config = configx[0];
        var instructions = `You are talking to John.`;
        if (config.instructions)
            instructions += config.instructions;
        if (config.abc_for_urges)
            instructions += config.abc_for_urges;
        if (config.behavior_cost_benefit)
            instructions += config.behavior_cost_benefit;
        if (config.change_plan)
            instructions += config.change_plan;
        if (config.hierarchy_of_values)
            instructions += config.hierarchy_of_values;
        if (config.disputing_unhelpful_beliefs)
            instructions += config.disputing_unhelpful_beliefs;
        if (config.explore_new_pursuits_and_passions)
            instructions += config.explore_new_pursuits_and_passions;
        if (config.five_questions_to_get_what_you_want)
            instructions += config.five_questions_to_get_what_you_want;
        if (config.goal_setting)
            instructions += config.goal_setting;
        if (config.life_balance_wheel)
            instructions += config.life_balance_wheel;
        if (config.personify_and_disarm)
            instructions += config.personify_and_disarm;
        if (config.practice_self_compassion)
            instructions += config.practice_self_compassion;
        if (config.put_dents_in_urges)
            instructions += config.put_dents_in_urges;
        if (config.setting_healthy_boundaries)
            instructions += config.setting_healthy_boundaries;
        if (config.urge_log)
            instructions += config.urge_log;
        ;
        //var instructions = 'say hello';
        console.log('instructions ------', instructions);
        const response = await this.client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                // In the new SDK, it is an explicit config field
                systemInstruction: instructions,
                temperature: 0.8,
            },
        });
        return response.text;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)((0, tsyringe_1.delay)(() => system_service_1.SystemService))),
    __metadata("design:paramtypes", [system_service_1.SystemService])
], ChatService);
//# sourceMappingURL=chat.service.js.map