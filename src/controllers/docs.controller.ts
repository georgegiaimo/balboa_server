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

    

    public uploadUsersFromCSV = async (req: any, res: Response): Promise<Response> => {

  try {
    // 1. Validate that the file exists
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No CSV file provided.' 
      });
    }

    var run_id = Number(req.query.id);
    var type = req.query.type;
    var org_unit = req.query.org_unit;

    // 2. Call the service to process the file
    // The path is guaranteed to be a string here because of the check above
    const response = await this.docsService.uploadUsersFromCSV(req.file.path, run_id, type, org_unit);

    if (response.error) {
        return res.status(400).json(response);
    }
    else{

    // 3. Return success response
    return res.status(200).json({
      success: true,
      //message: `Successfully imported ${recordCount} assignments.`,
      //count: recordCount
    });
    }

  } catch (error: any) {
    console.error('Upload Controller Error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred during the bulk import.',
      details: error.message || 'Unknown server error'
    });
  }
};

}