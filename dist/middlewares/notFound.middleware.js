"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundMiddleware = void 0;
const httpException_1 = require("../exceptions/httpException");
const NotFoundMiddleware = (_req, _res, next) => {
    next(new httpException_1.HttpException(404, 'Not Found'));
};
exports.NotFoundMiddleware = NotFoundMiddleware;
//# sourceMappingURL=notFound.middleware.js.map