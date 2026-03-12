"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGIN_LIST = exports.GEMINI_API_KEY = exports.API_SERVER_URL = exports.REDIS_URL = exports.SENTRY_DSN = exports.CREDENTIALS = exports.ORIGIN = exports.LOG_LEVEL = exports.LOG_DIR = exports.LOG_FORMAT = exports.SECRET_KEY = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const path_1 = require("path");
const zod_1 = require("zod");
/**
 * 1) dotenv 로드 순서
 *    - .env (공통)
 *    - .env.{NODE_ENV}.local (환경별 override, 있으면 덮어씀)
 */
(0, dotenv_1.config)(); // .env
const nodeEnv = process.env.NODE_ENV || 'development';
const layerPath = (0, path_1.resolve)(process.cwd(), `.env.${nodeEnv}.local`);
if ((0, fs_1.existsSync)(layerPath)) {
    (0, dotenv_1.config)({ path: layerPath });
}
/**
 * 2) Zod 스키마 정의
 *    - 필수/선택/기본값 정책은 필요에 맞게 수정 가능
 */
const EnvSchema = zod_1.z
    .object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().int().positive().optional(), // 기본값은 app.ts에서 3000 처리
    SECRET_KEY: zod_1.z.string().min(1),
    LOG_FORMAT: zod_1.z.string().min(1).optional(), // 기본값은 app.ts에서 'dev'
    LOG_DIR: zod_1.z.string().min(1),
    LOG_LEVEL: zod_1.z.string().min(1),
    ORIGIN: zod_1.z.string().min(1), // 필요시 배열화 가능
    CREDENTIALS: zod_1.z.coerce.boolean(), // 'true'/'false' 문자열 → boolean
    CORS_ORIGINS: zod_1.z.string().optional(), // "http://a.com,http://b.com"
    API_SERVER_URL: zod_1.z.string().url().optional(),
    SENTRY_DSN: zod_1.z.string().default(''),
    REDIS_URL: zod_1.z.string().url().default('redis://localhost:6379'),
    GEMINI_API_KEY: zod_1.z.string()
})
    .strip();
/**
 * 3) 검증(모듈 import 시점에 실행)
 */
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('\n❌ Invalid environment variables:\n');
    console.error(parsed.error.format());
    process.exit(1);
}
const env = parsed.data;
/**
 * 4) 타입 안전한 상수 export
 *    - 다른 파일에서는 process.env 직접 쓰지 말고 여기서만 가져가세요.
 */
exports.NODE_ENV = env.NODE_ENV;
exports.PORT = env.PORT; // app.ts에서 PORT || 3000
exports.SECRET_KEY = env.SECRET_KEY;
exports.LOG_FORMAT = env.LOG_FORMAT; // app.ts에서 LOG_FORMAT || 'dev'
exports.LOG_DIR = env.LOG_DIR;
exports.LOG_LEVEL = env.LOG_LEVEL;
exports.ORIGIN = env.ORIGIN;
exports.CREDENTIALS = env.CREDENTIALS;
exports.SENTRY_DSN = env.SENTRY_DSN;
exports.REDIS_URL = env.REDIS_URL;
exports.API_SERVER_URL = env.API_SERVER_URL;
exports.GEMINI_API_KEY = env.GEMINI_API_KEY;
// CORS Origins를 배열로도 제공 (없으면 [])
exports.CORS_ORIGIN_LIST = env.CORS_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
//# sourceMappingURL=env.js.map