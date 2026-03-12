import { Request, Response, NextFunction } from 'express';
import { SystemService } from '../services/system.service';
export declare class SystemController {
    private systemService;
    constructor(systemService: SystemService);
    getConfiguration: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateConfiguration: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
