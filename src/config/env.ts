import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';


config(); // .env
const nodeEnv = process.env.NODE_ENV || 'development';
const layerPath = resolve(process.cwd(), `.env.${nodeEnv}.local`);
if (existsSync(layerPath)) {
  config({ path: layerPath });
}


const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().optional(), // 기본값은 app.ts에서 3000 처리

    SECRET_KEY: z.string().min(1),

    LOG_FORMAT: z.string().min(1).optional(), // 기본값은 app.ts에서 'dev'
    LOG_DIR: z.string().min(1),
    LOG_LEVEL: z.string().min(1),

    ORIGIN: z.string().min(1), // 필요시 배열화 가능
    CREDENTIALS: z.coerce.boolean(), // 'true'/'false' 문자열 → boolean
    CORS_ORIGINS: z.string().optional(), // "http://a.com,http://b.com"

    API_SERVER_URL: z.string().url().optional(),

    SENTRY_DSN: z.string().default(''),
    REDIS_URL: z.string().url().default('redis://localhost:6379'),
    GEMINI_API_KEY: z.string(),
    AIRTABLE_PERSONAL_ACCESS_TOKEN: z.string()
  })
  .strip();


  const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('\n❌ Invalid environment variables:\n');
  console.error(parsed.error.format());
  process.exit(1);
}
const env = parsed.data;

export const NODE_ENV = env.NODE_ENV;
export const PORT = env.PORT; 
export const SECRET_KEY = env.SECRET_KEY;

export const LOG_FORMAT = env.LOG_FORMAT; 
export const LOG_DIR = env.LOG_DIR;
export const LOG_LEVEL = env.LOG_LEVEL;

export const ORIGIN = env.ORIGIN;
export const CREDENTIALS = env.CREDENTIALS;

export const SENTRY_DSN = env.SENTRY_DSN;
export const REDIS_URL = env.REDIS_URL;
export const API_SERVER_URL = env.API_SERVER_URL;

export const GEMINI_API_KEY = env.GEMINI_API_KEY;
export const AIRTABLE_PERSONAL_ACCESS_TOKEN = env.AIRTABLE_PERSONAL_ACCESS_TOKEN;


export const CORS_ORIGIN_LIST =
  env.CORS_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
