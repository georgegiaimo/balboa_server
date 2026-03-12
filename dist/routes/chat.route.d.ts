import { ChatController } from '../controllers/chat.controller';
import { Routes } from '../interfaces/routes.interface';
export declare class ChatRoute implements Routes {
    private chatController;
    path: string;
    router: import("express-serve-static-core").Router;
    constructor(chatController: ChatController);
    private initializeRoutes;
}
