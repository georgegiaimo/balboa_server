import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { GoogleController } from '@controllers/google.controller';
import { Routes } from '@interfaces/routes.interface';

@injectable()
export class GoogleRoute implements Routes {
  public path = '/google';
  public router = Router();

  
  constructor(@inject(GoogleController) private googleController: GoogleController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // We pass the function reference. Controller handles (req, res, next)
    //this.router.get(`${this.path}/getUsersFromDirectory`, this.googleController.getUsersFromDirectory);
    
    this.router.post(`${this.path}/addUserToGoogle`, this.googleController.addUserToGoogle);
    this.router.post(`${this.path}/updateUserInGoogle`, this.googleController.updateUserInGoogle);
    this.router.post(`${this.path}/deleteUserInGoogle`, this.googleController.deleteUserInGoogle);
    this.router.get(`${this.path}/syncData`, this.googleController.syncData);
    this.router.post(`${this.path}/createGoogleOrgUnit`, this.googleController.createGoogleOrgUnit);
    this.router.post(`${this.path}/updateGoogleOrgUnit`, this.googleController.updateGoogleOrgUnit);
    this.router.post(`${this.path}/deleteGoogleOrgUnit`, this.googleController.deleteGoogleOrgUnit);
    this.router.post(`${this.path}/deleteUsersBulk`, this.googleController.deleteUsersBulk);
  }
}