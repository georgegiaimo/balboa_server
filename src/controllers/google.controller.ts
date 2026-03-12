import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { GoogleService } from '@services/google.service';

@injectable()
export class GoogleController {
    constructor(@inject(GoogleService) private googleService: GoogleService) { }

    public getUsersFromDirectory = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Controller calls the service
            const result = await this.googleService.getAllUsersFromDirectory();

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };


}