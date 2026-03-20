import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { NextFunction } from 'express-serve-static-core';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    logIn: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    getAdminFromToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendResetLink: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logOut: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
