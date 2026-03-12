import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ApisService } from '@services/apis.service';

@injectable()
export class ApisController {
    constructor(@inject(ApisService) private apisService: ApisService) { }

    public getProductions = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Controller calls the service
            const result = await this.apisService.getProductions();

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public getProductionDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var production_id = Number(req.query.id);         

            // Controller calls the service
            const result = await this.apisService.getProductionDetails(production_id);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var user_id = Number(req.query.id); 
            // Controller calls the service
            const result = await this.apisService.getUserDetails(user_id);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Controller calls the service
            const result = await this.apisService.getUsers();

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public getDomainDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var domain = req.query.domain as string; 
            // Controller calls the service
            const result = await this.apisService.getDomainDetails(domain);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public getAdmins = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Controller calls the service
            const result = await this.apisService.getAdmins();

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public addAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { first_name, last_name, email, role } = req.body;

            // Controller handles basic validation
            if (!first_name) return res.status(400).json({ message: 'First name is required' });
            else if (!last_name) return res.status(400).json({ message: 'Last name is required' });
            else if (!email) return res.status(400).json({ message: 'Email is required' });
            else if (!role) return res.status(400).json({ message: 'Role is required' });

            // Controller calls the service
            const result = await this.apisService.addAdmin(first_name, last_name, email, role);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public getAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const admin_id = req.query.id as string;

            // 2. Optional: Basic validation
            if (!admin_id) {
                return res.status(400).json({ message: 'ID query parameter is required' });
            }

            // Controller calls the service
            const result = await this.apisService.getAdmin(Number(admin_id));

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            // Controller calls the service
            const result = await this.apisService.updateAdmin(data);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

    public getCoordinators = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Controller calls the service
            const result = await this.apisService.getCoordinators();

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };


}