import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { ReportsController } from '@controllers/reports.controller';
import { Routes } from '@interfaces/routes.interface';

@injectable()
export class ReportsRoute implements Routes {
  public path = '/reports';
  public router = Router();

  
  constructor(@inject(ReportsController) private reportsController: ReportsController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // We pass the function reference. Controller handles (req, res, next)
    this.router.get(`${this.path}/getDashboardData`, this.reportsController.getDashboardData);
  }
}