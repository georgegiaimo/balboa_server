import { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
export declare function ValidationMiddleware(schema: ZodTypeAny): (req: Request, res: Response, next: NextFunction) => void;
