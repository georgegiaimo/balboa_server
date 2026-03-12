"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const zod_1 = require("zod");
const env_1 = require("../config/env");
const httpException_1 = require("../exceptions/httpException");
const logger_1 = require("../utils/logger");
/** 타입가드들 */
const isZodError = (e) => {
    return e instanceof zod_1.ZodError;
};
/** jsonwebtoken은 런타임에 따라 클래스 경계 이슈가 있을 수 있어 name 기반 가드 권장 */
const isTokenExpiredError = (e) => {
    return e instanceof Error && e.name === 'TokenExpiredError';
};
const isJsonWebTokenError = (e) => {
    return e instanceof Error && e.name === 'JsonWebTokenError';
};
const toHttpException = (err) => {
    if (err instanceof httpException_1.HttpException)
        return err;
    if (isZodError(err)) {
        const data = err.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
        }));
        return new httpException_1.HttpException(400, 'Validation failed', data);
    }
    if (isTokenExpiredError(err))
        return new httpException_1.HttpException(401, 'Token expired');
    if (isJsonWebTokenError(err))
        return new httpException_1.HttpException(401, 'Invalid token');
    const e = err;
    return new httpException_1.HttpException(500, e?.message || 'Internal Server Error');
};
const extractStack = (err) => {
    if (err && typeof err === 'object' && 'stack' in err) {
        const s = err.stack;
        return typeof s === 'string' ? s : undefined;
    }
    return undefined;
};
const ErrorMiddleware = (error, req, res, _next) => {
    const httpErr = toHttpException(error);
    const status = httpErr.status || 500;
    const message = httpErr.message || 'Something went wrong';
    if (res.headersSent)
        return _next(httpErr);
    const stack = extractStack(httpErr);
    logger_1.logger.error(`[${req.method}] ${req.originalUrl} | ${status} | ${message}${stack ? `\n${stack}` : ''}`);
    const body = {
        success: false,
        error: { code: status, message },
    };
    const maybeData = httpErr.data;
    if (typeof maybeData !== 'undefined')
        body.error.data = maybeData;
    if (env_1.NODE_ENV === 'development' && stack)
        body.error.stack = stack;
    res.status(status).json(body);
};
exports.ErrorMiddleware = ErrorMiddleware;
//# sourceMappingURL=error.middleware.js.map