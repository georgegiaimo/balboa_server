import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { Routes } from '@interfaces/routes.interface';
import { LogsController } from '@/controllers/logs.controller';

@injectable()
export class LogsRoute implements Routes {
  public path = '/logs';
  public router = Router();

  
  constructor(@inject(LogsController) private logsController: LogsController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // We pass the function reference. Controller handles (req, res, next)
    this.router.get(`${this.path}/getLogs`, this.logsController.getLogs);
    this.router.post(`${this.path}/writeToLogs`, this.logsController.writeToLogs);
  }
}