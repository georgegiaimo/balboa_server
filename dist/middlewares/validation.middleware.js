"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = ValidationMiddleware;
const httpException_1 = require("../exceptions/httpException");
function ValidationMiddleware(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const message = result.error.issues.map((e) => e.message).join(', ');
            return next(new httpException_1.HttpException(400, message));
        }
        req.body = result.data;
        next();
    };
}
//# sourceMappingURL=validation.middleware.js.map