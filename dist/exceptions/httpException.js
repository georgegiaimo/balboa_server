"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(status, message, data) {
        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.HttpException = HttpException;
//# sourceMappingURL=httpException.js.map