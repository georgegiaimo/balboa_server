import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { Routes } from '../interfaces/routes.interface';
export declare class UsersRoute implements Routes {
    private userController;
    router: Router;
    path: string;
    constructor(userController: UsersController);
    private initializeRoutes;
}
