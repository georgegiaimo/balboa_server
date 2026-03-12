import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { ChatController } from '@controllers/chat.controller';
import { Routes } from '@interfaces/routes.interface';

@injectable()
export class ChatRoute implements Routes {
  public path = '/chat';
  public router = Router();

  constructor(@inject(ChatController) private chatController: ChatController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // We pass the function reference. Controller handles (req, res, next)
    this.router.post(`${this.path}/userMessage`, this.chatController.userMessage);
    this.router.post(`${this.path}/summarizeConversation`, this.chatController.summarizeConversation);
  }
}