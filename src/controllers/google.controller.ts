import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { GoogleService } from '@services/google.service';

@injectable()
export class GoogleController {
    constructor(@inject(GoogleService) private googleService: GoogleService) { }
    /*
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
    */
   public addUserToGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var user_data = req.body;

            if (!user_data.domain) {
                return res.status(400).json({ message: 'User domain required. Expected a domain value of crew-tv, mount22prod or seriescrew.' });
            }
            // Controller calls the service
            const result = await this.googleService.addUserToGoogle(user_data);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public updateUserInGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var user_data = req.body;

            if (!user_data.google_id) {
                return res.status(400).json({ message: 'Google ID is required' });
            }
            // Controller calls the service
            const result = await this.googleService.updateUserInGoogle(user_data);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public deleteUserInGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var user_data = req.body;

            if (!user_data.google_id) {
                return res.status(400).json({ message: 'Google ID required.' });
            }
            // Controller calls the service
            const result = await this.googleService.deleteUserInGoogle(user_data);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public syncData = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Controller calls the service
            const result = await this.googleService.syncGoogleData();

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public createGoogleOrgUnit = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var user_data = req.body;

            if (!user_data.domain) {
                return res.status(400).json({ message: 'User domain required. Expected a domain value of crew-tv, mount22prod or seriescrew.' });
            }
            // Controller calls the service
            const result = await this.googleService.createGoogleOrgUnit(user_data);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public updateGoogleOrgUnit = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var user_data = req.body;

            if (!user_data.domain) {
                return res.status(400).json({ message: 'User domain required. Expected a domain value of crew-tv, mount22prod or seriescrew.' });
            }
            // Controller calls the service
            const result = await this.googleService.updateGoogleOrgUnit(user_data);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public deleteGoogleOrgUnit = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var user_data = req.body;

            if (!user_data.domain) {
                return res.status(400).json({ message: 'User domain required. Expected a domain value of crew-tv, mount22prod or seriescrew.' });
            }
            // Controller calls the service
            const result = await this.googleService.deleteGoogleOrgUnit(user_data);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };


}