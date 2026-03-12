import { Request, Response, NextFunction } from 'express';
import { ReportsService } from '../services/reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getDashboardData: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
