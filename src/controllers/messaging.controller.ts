import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { MessagingService } from '@services/messaging.service';

@injectable()
export class MessagingController {
    constructor(@inject(MessagingService) private messagingService: MessagingService) { }

    public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var message = req.body; 
            // Controller calls the service
            const result = await this.messagingService.sendMessage(message);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

}