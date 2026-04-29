import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { DocsController } from '@controllers/docs.controller';
import { Routes } from '@interfaces/routes.interface';
import multer from 'multer';

@injectable()
export class DocsRoute implements Routes {
  public path = '/docs';
  public router = Router();

  

  
  constructor(@inject(DocsController) private docsController: DocsController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // This tells Multer where to store the temporary CSV files
    const upload = multer({ dest: 'uploads/' });

    // We pass the function reference. Controller handles (req, res, next)
    this.router.get(`${this.path}/getProductionReport`, this.docsController.getProductionReport);
    //this.router.post(`${this.path}/uploadUsersFromCSV`, this.docsController.uploadUsersFromCSV);
    this.router.post(`${this.path}/uploadUsersFromCSV`, upload.single('file'), this.docsController.uploadUsersFromCSV);
  }
}