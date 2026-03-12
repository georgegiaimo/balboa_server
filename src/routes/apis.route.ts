import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { ApisController } from '@controllers/apis.controller';
import { Routes } from '@interfaces/routes.interface';

@injectable()
export class ApisRoute implements Routes {
  public path = '/apis';
  public router = Router();

  
  constructor(@inject(ApisController) private apisController: ApisController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // We pass the function reference. Controller handles (req, res, next)
    this.router.get(`${this.path}/getProductions`, this.apisController.getProductions);
    this.router.get(`${this.path}/getProductionDetails`, this.apisController.getProductionDetails);
    this.router.get(`${this.path}/domainDetails`, this.apisController.getDomainDetails);
    this.router.get(`${this.path}/getUserDetails`, this.apisController.getUserDetails);
    this.router.get(`${this.path}/getDomainDetails`, this.apisController.getDomainDetails);
    this.router.get(`${this.path}/getUsers`, this.apisController.getUsers);
    this.router.get(`${this.path}/getAdmins`, this.apisController.getAdmins);
    this.router.post(`${this.path}/addAdmin`, this.apisController.addAdmin);
    this.router.get(`${this.path}/getAdmin`, this.apisController.getAdmin);
    this.router.post(`${this.path}/updateAdmin`, this.apisController.updateAdmin);
    this.router.get(`${this.path}/getCoordinators`, this.apisController.getCoordinators);
  }
}