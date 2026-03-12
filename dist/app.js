"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
require("reflect-metadata"); // Must be first
require("./database.config");
const error_middleware_1 = require("./middlewares/error.middleware");
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const logger_1 = require("./utils/logger");
const jobs_1 = require("./jobs");
class App {
    constructor(routes, apiPrefix = '', googleService, airtableService) {
        this.googleService = googleService;
        this.airtableService = airtableService;
        this.app = (0, express_1.default)();
        this.env = env_1.NODE_ENV || 'development';
        this.port = env_1.PORT || 3000;
        this.initializeTrustProxy();
        this.initializeMiddlewares();
        this.initializeRoutes(routes, apiPrefix);
        this.initializeErrorHandling();
        // Now this will work
        //console.log('googleService', this.googleService);
        //this.googleService.getAllUsersFromDirectory();
        //this.googleService.syncGoogleData();
        //this.airtableService.getAirtableDataProductions();
    }
    listen() {
        const server = this.app.listen(this.port, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`======= ENV: ${this.env} =======`);
            logger_1.logger.info(`🚀 App listening on the port ${this.port}`);
            logger_1.logger.info(`=================================`);
            (0, jobs_1.initializeCronJobs)();
        });
        return server;
    }
    getServer() {
        return this.app;
    }
    initializeTrustProxy() {
        this.app.set('trust proxy', 1);
    }
    initializeMiddlewares() {
        this.app.use((0, express_rate_limit_1.default)({
            windowMs: 60000,
            limit: this.env === 'production' ? 100 : 1000,
            standardHeaders: true,
            legacyHeaders: false,
            skip: (req) => this.env !== 'production' ||
                ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.ip ?? ''),
        }));
        this.app.use((0, morgan_1.default)(env_1.LOG_FORMAT || 'dev', { stream: logger_1.stream }));
        // CORS
        const allowedOrigins = env_1.CORS_ORIGIN_LIST.length > 0 ? env_1.CORS_ORIGIN_LIST : ['http://localhost:4200'];
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: env_1.CREDENTIALS,
        }));
        this.app.use((0, hpp_1.default)());
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: this.env === 'production'
                ? {
                    directives: {
                        defaultSrc: ["'self'"],
                        scriptSrc: ["'self'", "'unsafe-inline'"],
                        objectSrc: ["'none'"],
                        upgradeInsecureRequests: [],
                    },
                }
                : false,
            referrerPolicy: { policy: 'no-referrer' },
        }));
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRoutes(routes, apiPrefix) {
        routes.forEach((route) => {
            // Combine /api + /chat to mount the router at /api/chat
            const fullPath = apiPrefix.replace(/\/+/g, '/');
            this.app.use(fullPath, route.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(notFound_middleware_1.NotFoundMiddleware);
        this.app.use(error_middleware_1.ErrorMiddleware);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map