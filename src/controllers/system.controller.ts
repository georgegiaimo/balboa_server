import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { SystemService } from '@services/system.service';

@injectable()
export class SystemController {
  constructor(@inject(SystemService) private systemService: SystemService) {}

  public getConfiguration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      // Controller calls the service
      const result = await this.systemService.getConfiguration();

      // Controller sends the final response
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  };

  public updateConfiguration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contents } = req.body;

      console.log('contents', contents);
      console.log('req.body', req.body);

      // Controller handles basic validation
      if (!contents) return res.status(400).json({ message: 'Data is required' });

      // Controller calls the service
      const result = await this.systemService.updateConfiguration(contents);

      // Controller sends the final response
      res.status(200).json({ data: result, message: 'success' });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  };
}