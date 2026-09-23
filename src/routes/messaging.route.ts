import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { MessagingController } from '@controllers/messaging.controller';
import { Routes } from '@interfaces/routes.interface';
import multer from 'multer';

@injectable()
export class MessagingRoute implements Routes {
  public path = '/messaging';
  public router = Router();

  

  
  constructor(@inject(MessagingController) private messagingController: MessagingController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // We pass the function reference. Controller handles (req, res, next)
    this.router.post(`${this.path}/sendMessage`, this.messagingController.sendMessage);
  }
}