"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCronJobs = void 0;
const google_sync_job_1 = require("./google_sync.job");
const initializeCronJobs = () => {
    (0, google_sync_job_1.initGoogleSync)();
    console.log('✅ All cron jobs have been initialized.');
};
exports.initializeCronJobs = initializeCronJobs;
//# sourceMappingURL=index.js.map