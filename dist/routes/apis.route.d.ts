import { ApisController } from '../controllers/apis.controller';
import { Routes } from '../interfaces/routes.interface';
export declare class ApisRoute implements Routes {
    private apisController;
    path: string;
    router: import("express-serve-static-core").Router;
    constructor(apisController: ApisController);
    private initializeRoutes;
}
