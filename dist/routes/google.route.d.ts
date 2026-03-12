import { GoogleController } from '../controllers/google.controller';
import { Routes } from '../interfaces/routes.interface';
export declare class GoogleRoute implements Routes {
    private googleController;
    path: string;
    router: import("express-serve-static-core").Router;
    constructor(googleController: GoogleController);
    private initializeRoutes;
}
