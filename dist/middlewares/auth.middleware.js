"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const tsyringe_1 = require("tsyringe");
const env_1 = require("../config/env");
const httpException_1 = require("../exceptions/httpException");
const users_repository_1 = require("../repositories/users.repository");
const getAuthorization = (req) => {
    const cookie = req.cookies['Authorization'];
    if (cookie)
        return cookie;
    const header = req.header('Authorization');
    if (header && header.startsWith('Bearer ')) {
        return header.replace('Bearer ', '').trim();
    }
    return null;
};
const AuthMiddleware = async (req, res, next) => {
    try {
        const userReq = req;
        const token = getAuthorization(userReq);
        if (!token)
            return next(new httpException_1.HttpException(401, 'Authentication token missing'));
        let payload;
        try {
            payload = (0, jsonwebtoken_1.verify)(token, env_1.SECRET_KEY);
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                return next(new httpException_1.HttpException(401, 'Authentication token expired'));
            }
            if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                return next(new httpException_1.HttpException(401, 'Invalid authentication token'));
            }
            return next(new httpException_1.HttpException(401, 'Authentication failed'));
        }
        const userRepo = tsyringe_1.container.resolve(users_repository_1.UsersRepository);
        const findUser = await userRepo.findById(String(payload.id));
        if (!findUser)
            return next(new httpException_1.HttpException(401, 'User not found with this token'));
        req.user = findUser;
        next();
    }
    catch {
        next(new httpException_1.HttpException(500, 'Authentication middleware error'));
    }
};
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map