import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';
import { ApisService } from './apis.service';
import { inject, injectable } from 'tsyringe';
import { CommonService } from './common.service';


/**
 * Interface Definitions for Production Data
 */
@injectable()
export class DocsService {
    private browser: puppeteer.Browser | null = null;
    private blobServiceClient!: BlobServiceClient;
    private readonly containerName = 'production-reports';

    constructor(
        @inject(ApisService) public apisService: ApisService,
        @inject(CommonService) public commonService: CommonService
    ) {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        if (!accountName) {
            throw new Error("AZURE_STORAGE_ACCOUNT_NAME environment variable is required.");
        }

        // Uses DefaultAzureCredential for secure, keyless auth in Azure environments
        /*
        this.blobServiceClient = new BlobServiceClient(
          `https://${accountName}.blob.core.windows.net`,
          new DefaultAzureCredential()
        );
        */


    }

    /**
     * Generates a PDF from a Production object and uploads it to Azure Blob Storage
     * @param production The Production data object
     * @returns The URL of the uploaded blob
     */
    public async generateAndUploadReport(production_id: any): Promise<string> {

        //get production details
        var data: any = await this.apisService.getProductionDetails(production_id);
        const production = data.production;
        const users = data.users;
        var activity = data.activity;
        const coordinators = data.coordinators;


        users.forEach((x: any, i: number) => {
            x.ctr = i + 1;
        });

        //parse activity texts
        for (let item of activity){
            if (item.action = 'new-assignment') {
                var user: any = await this.apisService.getUserDetails(item.user_id);
                item.text = `${user.user.first_name} ${user.user.last_name} was added to the production.`;
            }
            else if (item.action == 'assignment-removed'){
                var user: any = await this.apisService.getUserDetails(item.user_id);
                item.text = `${user.user.first_name} ${user.user.last_name} was removed from the production.`;
            }
        }

        activity = activity.filter((x:any) =>  {return x.text;});

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const displayDate = new Date().toLocaleDateString('en-US', options);

        var data_for_template = {
            production: production,
            users: users,
            activity: activity,
            coordinators: coordinators,
            date: displayDate
        }


        console.log('data_for_template', data_for_template.date);

        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

        if (!connectionString) {
            throw new Error("AZURE_STORAGE_CONNECTION_STRING is not defined in environment variables");
        }

        this.blobServiceClient = await BlobServiceClient.fromConnectionString(connectionString);

        let page: puppeteer.Page | null = null;

        try {
            // 1. Compile HTML Template
            const html = this.compileTemplate(data_for_template);

            // 2. Manage Singleton Browser Instance
            if (!this.browser || !this.browser.connected) {
                this.browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
            }

            page = await this.browser.newPage();

            // Set content and wait for it to be fully rendered (networkidle0 handles external CSS/Fonts)
            await page.setContent(html, { waitUntil: 'networkidle0' });

            // 3. Generate PDF Buffer
            // page.pdf returns a Uint8Array; we wrap it in Buffer.from to satisfy Node/Azure types
            const pdfUint8Array = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
                displayHeaderFooter: true,
                headerTemplate: `<span style="font-size: 10px; width: 100%; text-align: right; margin-right: 20px; color: #94a3b8;">Balboa Computer | ${production.name}}</span>`,
                footerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center; color: #94a3b8;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
            });

            const pdfBuffer = Buffer.from(pdfUint8Array);

            // 4. Azure Upload
            const blobName = `production-${production.production_id}-${Date.now()}.pdf`;
            const containerClient: ContainerClient = this.blobServiceClient.getContainerClient('reports');
            const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(pdfBuffer, {
                blobHTTPHeaders: { 
                    blobContentType: 'application/pdf',
                    blobContentDisposition: `attachment; filename="${encodeURIComponent(blobName)}"`
                }
            });

            return blockBlobClient.url;

        } catch (error) {
            console.error('[ProductionReportService] Error generating/uploading report:', error);
            throw error;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }

    /**
     * Cleans up the browser instance on service shutdown
     */
    public async shutdown(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    private compileTemplate(data: any): string {
        console.log('data', data.coordinators);
        const templateSource = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; background-color: #ffffff; }
            .container { padding: 0 40px 40px 40px; }
            .header { border-bottom: 3px solid #0d9488; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            h1 { color: #0f172a; margin: 0; font-size: 28px; letter-spacing: -0.025em; }
            .id-badge { color: #64748b; font-size: 12px; font-family: monospace; }
            
            .section { margin-bottom: 32px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .section-header { background: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
            .section-content { padding: 20px; }
            
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
            .grid .section { margin-bottom: 0; }
            
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase; padding: 12px 15px; border-bottom: 2px solid #f1f5f9; }
            td { padding: 14px 15px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
            tr:last-child td { border-bottom: none; }
            
            .status-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: #f1f5f9; color: #475569; }
            .status-Completed { background: #dcfce7; color: #166534; }
            .status-In-Progress { background: #e0f2fe; color: #075985; }
            .status-Pending { background: #fef9c3; color: #854d0e; }
            
            .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; display: block; }
            .value { font-size: 14px; font-weight: 500; display: inline-block;}
            .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .max-w-140 { max-width: 140px;}
            .max-w-180 { max-width: 180px;}
            .header-logo { width: 120px; }
}
            
            @media print {
              .section { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="header-logo" src="https://balboa.blob.core.windows.net/system/bfa7d6ef-a2cd-4b19-8c83-e77d7d73d21f (1).png">
            <div class="header">
              <h1>{{production.name}}</h1>
              <span class="id-badge">Report Date: {{date}}</span>
            </div>

            
              <div class="section">
                <div class="section-header">Production Details</div>
                <div class="section-content">
                  <span class="label">Production Name</span>
                  <div class="value">{{production.name}}</div>
                  <div style="margin-top: 12px;">
                    <span class="label">Organizational Unit</span>
                    <div class="value">{{production.org_unit_path}}</div>
                  </div>
                  <div style="margin-top: 12px;">
                    <span class="label">Domain</span>
                    <div class="value">{{production.domain}}</div>
                  </div>
                  <div style="margin-top: 12px;">
                    <span class="label">Coordinator</span>
                     {{#each coordinators}}
                    <div class="value">{{this.first_name}}&nbsp;{{this.last_name}}&nbsp;({{this.email}})</div>
                    {{/each}}
                  </div>
                  <div style="margin-top: 12px;">
                    <span class="label">Users</span>
                    <div class="value">{{users.length}}</div>
                  </div>
                </div>
              </div>
            

            <div class="section">
              <div class="section-header">Latest Activity</div>
              <table>
                <thead>
                  <tr>
                    <th class="truncate max-w-140">Date</th>
                    <th class="truncate max-w-180">Action</th>
                </tr>
                </thead>
                <tbody>
                  {{#each activity}}
                  <tr>
                    <td class="truncate max-w-140">{{this.date}}</td>
                    <td class="truncate max-w-180">{{this.text}}</td>
                  </tr>
                  {{/each}}
                </tbody>
              </table>
              </div>
            </div>

            <div class="section">
              <div class="section-header">Production Users</div>
              <table>
                <thead>
                  <tr>
                    <th class="truncate max-w-160"></th>
                    <th class="truncate max-w-140">Name</th>
                    <th class="truncate max-w-180">Production Email</th>
                    <th class="truncate max-w-180">Personal Email</th>
                  </tr>
                </thead>
                <tbody>
                  {{#each users}}
                  <tr>
                    <td class="truncate max-w-160">{{this.ctr}}</td>
                    <td class="truncate max-w-140"><strong>{{this.first_name}}&nbsp;{{this.last_name}}</strong></td>
                    <td class="truncate max-w-180"><span style="color: #64748b;">{{this.production_email}}</span></td>
                    <td class="truncate max-w-180">{{this.personal_email}}</td>
                  </tr>
                  {{/each}}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;
        const template = handlebars.compile(templateSource);

        const final_html = template(data);
        //console.log('final_html', final_html);
        return final_html;
    }
}

// Export as a singleton for use across your application
//export const productionReportService = new ProductionReportService();