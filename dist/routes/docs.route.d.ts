import { DocsController } from '../controllers/docs.controller';
import { Routes } from '../interfaces/routes.interface';
export declare class DocsRoute implements Routes {
    private docsController;
    path: string;
    router: import("express-serve-static-core").Router;
    constructor(docsController: DocsController);
    private initializeRoutes;
}
