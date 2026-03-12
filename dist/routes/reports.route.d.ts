import { ReportsController } from '../controllers/reports.controller';
import { Routes } from '../interfaces/routes.interface';
export declare class ReportsRoute implements Routes {
    private reportsController;
    path: string;
    router: import("express-serve-static-core").Router;
    constructor(reportsController: ReportsController);
    private initializeRoutes;
}
