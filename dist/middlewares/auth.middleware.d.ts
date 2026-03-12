import type { Request, Response, NextFunction } from 'express';
export declare const AuthMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
