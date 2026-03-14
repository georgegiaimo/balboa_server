import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthController } from '@controllers/auth.controller';
import { createUserSchema } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@injectable()
export class AuthRoute implements Routes {
  public router: Router = Router();
  public path = '/auth';

  constructor(@inject(AuthController) private authController: AuthController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`,this.authController.signUp);
    this.router.post(`${this.path}/logIn`, this.authController.logIn);
    this.router.get(`${this.path}/getAdminFromToken`, this.authController.getAdminFromToken);
    this.router.post(`${this.path}/resetPassword`, this.authController.resetPassword);
  }
}
