import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { SystemController } from '@controllers/system.controller';
import { Routes } from '@interfaces/routes.interface';

@injectable()
export class SystemRoute implements Routes {
  public path = '/system';
  public router = Router();

  
  constructor(@inject(SystemController) private systemController: SystemController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // We pass the function reference. Controller handles (req, res, next)
    this.router.get(`${this.path}/getConfiguration`, this.systemController.getConfiguration);
    this.router.post(`${this.path}/updateConfiguration`, this.systemController.updateConfiguration);
    this.router.post(`${this.path}/sendCode2FA`, this.systemController.sendCode2FA);
    this.router.post(`${this.path}/verifyCode2FA`, this.systemController.verifyCode2FA);
  }
}