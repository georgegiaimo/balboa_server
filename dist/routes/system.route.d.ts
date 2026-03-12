import { SystemController } from '../controllers/system.controller';
import { Routes } from '../interfaces/routes.interface';
export declare class SystemRoute implements Routes {
    private systemController;
    path: string;
    router: import("express-serve-static-core").Router;
    constructor(systemController: SystemController);
    private initializeRoutes;
}
