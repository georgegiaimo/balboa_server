import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
export declare class AuthRoute implements Routes {
    private authController;
    router: Router;
    path: string;
    constructor(authController: AuthController);
    private initializeRoutes;
}
