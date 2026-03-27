import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { DocsService } from '@services/docs.service';

@injectable()
export class DocsController {
    constructor(@inject(DocsService) private docsService: DocsService) { }

    public getProductionReport = async (req: Request, res: Response, next: NextFunction) => {
        try {

            var production_id = Number(req.query.id); 
            // Controller calls the service
            const result = await this.docsService.generateAndUploadReport(production_id);

            // Controller sends the final response
            res.status(200).json({ data: result, message: 'success' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
    };

}