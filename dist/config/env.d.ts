/**
 * 4) 타입 안전한 상수 export
 *    - 다른 파일에서는 process.env 직접 쓰지 말고 여기서만 가져가세요.
 */
export declare const NODE_ENV: "development" | "production" | "test";
export declare const PORT: number | undefined;
export declare const SECRET_KEY: string;
export declare const LOG_FORMAT: string | undefined;
export declare const LOG_DIR: string;
export declare const LOG_LEVEL: string;
export declare const ORIGIN: string;
export declare const CREDENTIALS: boolean;
export declare const SENTRY_DSN: string;
export declare const REDIS_URL: string;
export declare const API_SERVER_URL: string | undefined;
export declare const GEMINI_API_KEY: string;
export declare const CORS_ORIGIN_LIST: string[];
