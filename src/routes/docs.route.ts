import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { DocsController } from '@controllers/docs.controller';
import { Routes } from '@interfaces/routes.interface';

@injectable()
export class DocsRoute implements Routes {
  public path = '/docs';
  public router = Router();

  
  constructor(@inject(DocsController) private docsController: DocsController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // We pass the function reference. Controller handles (req, res, next)
    this.router.get(`${this.path}/getProductionReport`, this.docsController.getProductionReport);
  }
}