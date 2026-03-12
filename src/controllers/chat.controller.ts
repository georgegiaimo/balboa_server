import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ChatService } from '@services/chat.service';

@injectable()
export class ChatController {
  constructor(@inject(ChatService) private chatService: ChatService) {}

  public userMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, contents, userId } = req.body;

      // Controller handles basic validation
      if (!contents) return res.status(400).json({ message: 'Contents is required' });

      // Controller calls the service
      const result = await this.chatService.processUserMessage(userId, message, contents);

      // Controller sends the final response
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  };

  public summarizeConversation = async (req: Request, res: Response, next: NextFunction) => {
    /*
    try {
      const { contents } = req.body;

      // Controller handles basic validation
      if (!contents) return res.status(400).json({ message: 'Contents is required' });

      // Controller calls the service
      const result = await this.chatService.summarizeConversation(contents);

      // Controller sends the final response
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error); // Pass to global error handler
    }
      */
  };
}