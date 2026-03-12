import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    userMessage: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    summarizeConversation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
