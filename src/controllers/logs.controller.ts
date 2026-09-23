import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { LogsService } from '@/services/logs.service';

@injectable()
export class LogsController {
    constructor(@inject(LogsService) private logsService: LogsService) { }

    public getLogs = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Controller calls the service
            const result = await this.logsService.getLogs();

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public writeToLogs = async (req: Request, res: Response, next: NextFunction) => {
        try {

             var data = req.body; 
            // Controller calls the service
            const result = await this.logsService.writeToLogs(data);

            // Controller sends the final response
            res.status(200).json({ message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };


}