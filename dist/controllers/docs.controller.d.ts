import { Request, Response, NextFunction } from 'express';
import { DocsService } from '../services/docs.service';
export declare class DocsController {
    private docsService;
    constructor(docsService: DocsService);
    getProductionReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
