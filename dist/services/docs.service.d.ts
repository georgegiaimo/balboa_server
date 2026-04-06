import { ApisService } from './apis.service';
import { CommonService } from './common.service';
/**
 * Interface Definitions for Production Data
 */
export declare class DocsService {
    apisService: ApisService;
    commonService: CommonService;
    private browser;
    private blobServiceClient;
    private readonly containerName;
    constructor(apisService: ApisService, commonService: CommonService);
    /**
     * Generates a PDF from a Production object and uploads it to Azure Blob Storage
     * @param production The Production data object
     * @returns The URL of the uploaded blob
     */
    generateAndUploadReport(production_id: any): Promise<string>;
    /**
     * Cleans up the browser instance on service shutdown
     */
    shutdown(): Promise<void>;
    private compileTemplate;
}
