import type { Request, Response, NextFunction, RequestHandler } from 'express';
export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const asyncHandler: (fn: AsyncHandler) => RequestHandler;
