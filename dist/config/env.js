"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGIN_LIST = exports.AIRTABLE_PERSONAL_ACCESS_TOKEN = exports.GEMINI_API_KEY = exports.API_SERVER_URL = exports.REDIS_URL = exports.SENTRY_DSN = exports.CREDENTIALS = exports.ORIGIN = exports.LOG_LEVEL = exports.LOG_DIR = exports.LOG_FORMAT = exports.SECRET_KEY = exports.PORT = exports.ENVIRONMENT = void 0;
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const path_1 = require("path");
const zod_1 = require("zod");
(0, dotenv_1.config)(); // .env
const nodeEnv = process.env.ENVIRONMENT || 'development';
const layerPath = (0, path_1.resolve)(process.cwd(), `.env.${nodeEnv}.local`);
if ((0, fs_1.existsSync)(layerPath)) {
    (0, dotenv_1.config)({ path: layerPath });
}
const EnvSchema = zod_1.z
    .object({
    ENVIRONMENT: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().int().positive().optional(),
    SECRET_KEY: zod_1.z.string().min(1),
    LOG_FORMAT: zod_1.z.string().min(1).optional(),
    LOG_DIR: zod_1.z.string().min(1),
    LOG_LEVEL: zod_1.z.string().min(1),
    ORIGIN: zod_1.z.string().min(1),
    CREDENTIALS: zod_1.z.coerce.boolean(),
    CORS_ORIGINS: zod_1.z.string().optional(), // "http://a.com,http://b.com"
    API_SERVER_URL: zod_1.z.string().url().optional(),
    SENTRY_DSN: zod_1.z.string().default(''),
    REDIS_URL: zod_1.z.string().url().default('redis://localhost:6379'),
    GEMINI_API_KEY: zod_1.z.string(),
    AIRTABLE_PERSONAL_ACCESS_TOKEN: zod_1.z.string()
})
    .strip();
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('\n❌ Invalid environment variables:\n');
    console.error(parsed.error.format());
    process.exit(1);
}
const env = parsed.data;
exports.ENVIRONMENT = env.ENVIRONMENT;
exports.PORT = env.PORT;
exports.SECRET_KEY = env.SECRET_KEY;
exports.LOG_FORMAT = env.LOG_FORMAT;
exports.LOG_DIR = env.LOG_DIR;
exports.LOG_LEVEL = env.LOG_LEVEL;
exports.ORIGIN = env.ORIGIN;
exports.CREDENTIALS = env.CREDENTIALS;
exports.SENTRY_DSN = env.SENTRY_DSN;
exports.REDIS_URL = env.REDIS_URL;
exports.API_SERVER_URL = env.API_SERVER_URL;
exports.GEMINI_API_KEY = env.GEMINI_API_KEY;
exports.AIRTABLE_PERSONAL_ACCESS_TOKEN = env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
exports.CORS_ORIGIN_LIST = env.CORS_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
//# sourceMappingURL=env.js.map