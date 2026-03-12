"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGoogleSync = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const google_service_1 = require("../services/google.service");
const google_repository_1 = require("../repositories/google.repository"); // Import the missing piece
const database_config_1 = require("../database.config");
// 1. Create the repository
const googleRepository = new google_repository_1.GoogleRepository(database_config_1.pool);
// 2. Create the service by passing the repository into the constructor
const googleService = new google_service_1.GoogleService(googleRepository);
// It's best practice to wrap the job in a function or class
const initGoogleSync = () => {
    // Run every day at 3:00 AM
    node_cron_1.default.schedule('0 3 * * *', async () => {
        console.log('[Job] Starting Daily Sync Task...');
        try {
            await googleService.syncGoogleData();
            console.log('[Job] Daily Sync Task completed successfully.');
        }
        catch (error) {
            console.error('[Job Error] Daily Sync Task failed:', error);
        }
    });
};
exports.initGoogleSync = initGoogleSync;
//# sourceMappingURL=google_sync.job.js.map