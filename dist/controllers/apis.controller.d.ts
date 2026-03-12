import { Request, Response, NextFunction } from 'express';
import { ApisService } from '../services/apis.service';
export declare class ApisController {
    private apisService;
    constructor(apisService: ApisService);
    getProductions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductionDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDomainDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAdmins: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    updateAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCoordinators: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
