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
  }
}