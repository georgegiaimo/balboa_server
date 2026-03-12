import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ReportsService } from '@services/reports.service';

@injectable()
export class ReportsController {
    constructor(@inject(ReportsService) private reportsService: ReportsService) { }

    public getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Controller calls the service
            const result = await this.reportsService.getDashboardData();

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };


}