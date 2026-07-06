import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';
import { ApisService } from './apis.service';
import { inject, injectable } from 'tsyringe';
import { CommonService } from './common.service';
import { GoogleService } from './google.service';
const fs = require('fs');
const csv = require('csv-parser');

const past_users_emails = [
 {
   "name": "Ben Richardson",
   "email": "ben@benrichardson.com"
 },
 {
   "name": "Cary White",
   "email": "carywhite530@gmail.com"
 },
 {
   "name": "Charles Skinner",
   "email": "charlieskinner@mac.com"
 },
 {
   "name": "Chris Ness",
   "email": "chris.ness@me.com"
 },
 {
   "name": "Greg Gilman",
   "email": "greg.gilman@mac.com"
 },
 {
   "name": "Iman Corbani",
   "email": "imancorbani@gmail.com"
 },
 {
   "name": "Lisa Ward",
   "email": "lisaqward@gmail.com"
 },
 {
   "name": "Sumner Boissiere",
   "email": "sumner@patricknoelle.com"
 },
 {
   "name": "Hugh Ross",
   "email": "hross13@mac.com"
 },
 {
   "name": "Louis Fred Denomme",
   "email": "thenomme@yahoo.ca"
 },
 {
   "name": "Alain Caporicci",
   "email": "alaincaporicci@gmail.com"
 },
 {
   "name": "Alexandre Paul",
   "email": "alexpaul.montage@gmail.com"
 },
 {
   "name": "Amelie Bertrand",
   "email": "amelieb019@gmail.com"
 },
 {
   "name": "Andre-Pierre Lampron",
   "email": "amelieb019@gmail.com"
 },
 {
   "name": "Barnes Liz",
   "email": "lizbarnes.casting@gmail.com"
 },
 {
   "name": "Bertrand Amelie",
   "email": "amelieb019@gmail.com"
 },
 {
   "name": "Brigette Goulet",
   "email": "b_goulet@videotron.ca"
 },
 {
   "name": "Etienne Geofffrion",
   "email": "54thdivisiongripping@gmail.com"
 },
 {
   "name": "Frederic Berthiaume-Gabbino",
   "email": "fredbg@gmail.com"
 },
 {
   "name": "Gentiane Godin",
   "email": "ateliercostumes@outlook.com"
 },
 {
   "name": "Gottlieb Billy",
   "email": "billyg@playbackmusic.net"
 },
 {
   "name": "Green Akilah",
   "email": " Akilah.green@gmail.com"
 },
 {
   "name": "Ian Murphy",
   "email": "imurphy21@gmail.com"
 },
 {
   "name": "Jay Karas",
   "email": "karas.jay@gmail.com"
 },
 {
   "name": "John Timothy",
   "email": "johnwtimothy@gmail.com"
 },
 {
   "name": "Julie Montplaisir",
   "email": "j.montplaisir@sympatico.ca"
 },
 {
   "name": "Ken Coolen",
   "email": "ken.coolen@hotmail.com"
 },
 {
   "name": "Kira Kalush",
   "email": "kirakalush@gmail.com"
 },
 {
   "name": "Lauren Bridges",
   "email": "laurensbridges@gmail.com"
 },
 {
   "name": "Lecoufle Michel",
   "email": "michel.lecoufle@gmail.com"
 },
 {
   "name": "Liv Todaro",
   "email": "livtodarofilm@gmail.com"
 },
 {
   "name": "Marie-Pierre Poirier-Fournier",
   "email": "mariepierrepf@gmail.com"
 },
 {
   "name": "Marie-Soleil Denomme",
   "email": "denomme.design@gmail.com"
 },
 {
   "name": "Nancy Chiasson",
   "email": "nancy-chiasson@videotron.ca"
 },
 {
   "name": "Nicolas Gosselin",
   "email": "nicolas.gosselin@videotron.ca"
 },
 {
   "name": "Paul Viau",
   "email": "paulviau@icloud.com"
 },
 {
   "name": "Paul Winestock",
   "email": "schloque@gmail.com"
 },
 {
   "name": "Peter McDonough",
   "email": "peter.mcdonough28@gmail.com"
 },
 {
   "name": "Randi Wells",
   "email": "randi.kwcasting@gmail.com"
 },
 {
   "name": "Rishi Chitkara",
   "email": "rishi@rishi.biz"
 },
 {
   "name": "Rodolphe Paquereau",
   "email": "Paquereau"
 },
 {
   "name": "Sean Sweeney",
   "email": "seanswee@gmail.com"
 },
 {
   "name": "Simon Poudrette",
   "email": "sound.simon74@me.com"
 },
 {
   "name": "Sylvain Girouard",
   "email": "meche06@live.ca"
 },
 {
   "name": "Tannis Vallely",
   "email": "tvallelycasting@gmail.com"
 },
 {
   "name": "Tyler Davis",
   "email": "tyler.p.davis@gmail.com"
 },
 {
   "name": "Vanessa Arguello",
   "email": "vaness_a@live.ca"
 },
 {
   "name": "Sasha Axenova",
   "email": "alex.axenova@gmail.com"
 },
 {
   "name": "Yousif Nash",
   "email": "yousif.nash.1@gmail.com"
 },
 {
   "name": "Ben McDonald",
   "email": "ben.t.mcdonald@gmail.com"
 },
 {
   "name": "Colleen Hiltz",
   "email": "hiltz.colleen@gmail.com"
 },
 {
   "name": "Eva Colmenero",
   "email": "evac88@gmail.com"
 },
 {
   "name": "Majid Koudmani",
   "email": "majid.koudmani@gmail.com"
 },
 {
   "name": "Alex Aspden",
   "email": "aaspden87@gmail.com"
 },
 {
   "name": "Aoife Reed",
   "email": "aoife.reed@gmail.com"
 },
 {
   "name": "Christopher Straessle",
   "email": "straesslechris@gmail.com"
 },
 {
   "name": "Elen Kallas",
   "email": "elen@munchhausen.ee"
 },
 {
   "name": "Ella Callow",
   "email": "ella.callow@gmail.com"
 },
 {
   "name": "Eva Kuntz",
   "email": "eva_kuntz@hotmail.com"
 },
 {
   "name": "Fernando Da Silva",
   "email": "fernandofnsilva@yahoo.co.uk"
 },
 {
   "name": "Jess Meredith",
   "email": "jessicarosemeredith@live.co.uk"
 },
 {
   "name": "Joe Howard",
   "email": "joe_howard@me.com"
 },
 {
   "name": "Katy Schurr",
   "email": "katyschurr@gmail.com"
 },
 {
   "name": "Lily Gwynne - Thomas",
   "email": "lilyhannaht@hotmail.co.uk"
 },
 {
   "name": "Lisa Royle",
   "email": "lisaroyle@hotmail.com"
 },
 {
   "name": "Maria Novo",
   "email": "mariacostasnovo@gmail.com"
 },
 {
   "name": "Mimi Evans",
   "email": "mariarosamimi@hotmail.co.uk"
 },
 {
   "name": "Miranda Keeble",
   "email": "mirandakeeble@gmail.com"
 },
 {
   "name": "Naomi Atherton",
   "email": "naomi_atherton@icloud.com"
 },
 {
   "name": "Nick Murray",
   "email": "nick.w.murray@gmail.com"
 },
 {
   "name": "Nikolai Mihailisin",
   "email": "niko@munchhausen.ee"
 },
 {
   "name": "Pavel Andonov",
   "email": "pavelandonov8@gmail.com"
 },
 {
   "name": "Phil Clark",
   "email": "phil.clark@agua.nu"
 },
 {
   "name": "Rebecca Todd",
   "email": "arebeccatodd@gmail.com"
 },
 {
   "name": "Stephen Forrest-Smith",
   "email": "stevefs@mac.com"
 },
 {
   "name": "Thomas Huber",
   "email": "thms-hbr@hotmail.com"
 },
 {
   "name": "Tom Turner",
   "email": "tom_turner@hotmail.com"
 },
 {
   "name": "Graham Cussell",
   "email": "grahamcussell@icloud.com"
 },
 {
   "name": "Sergio Pedro",
   "email": "Sergiopedro2103@hotmail.com"
 },
 {
   "name": "Nick Moutselos",
   "email": "nickmoutselos@gmail.com"
 },
 {
   "name": "Adam Reid",
   "email": "adam.michael.reid@gmail.com"
 },
 {
   "name": "Christian Taylor",
   "email": "taylorchristian@me.com"
 },
 {
   "name": "David Neuman",
   "email": "david@davidneuman.com"
 },
 {
   "name": "Denys Yakovneko",
   "email": "minidenys@gmail.com"
 },
 {
   "name": "Easton Alexeyev",
   "email": "eastonalexeyev@gmail.com"
 },
 {
   "name": "Hawa Macalou",
   "email": "hawamacalou@gmail.com"
 },
 {
   "name": "Jeff Davis",
   "email": "jeffdavis75@mac.com"
 },
 {
   "name": "Juliana James",
   "email": "julianajames07@gmail.com"
 },
 {
   "name": "Max Reid",
   "email": "max.b.reid@gmail.com"
 },
 {
   "name": "Grace Leeson",
   "email": "fgleeson30@gmail.com"
 },
 {
   "name": "Margherita di Tullio",
   "email": "margheritaditullio@gmail.com"
 },
 {
   "name": "Melusine Frederic-Moreau",
   "email": "melusinefm@gmail.com"
 },
 {
   "name": "Nicole Kagan",
   "email": "nicolekagan@gmail.com"
 },
 {
   "name": "Madison Production",
   "email": "themadisonprod@gmail.com"
 },
 {
   "name": "Ben Chfristopher",
   "email": "Benchristophermedia@gmail.com"
 },
 {
   "name": "Chris Sibley-Hall",
   "email": "standbychris@gmail.com"
 },
 {
   "name": "Fenelia Jenkins",
   "email": "fj.thatch@btinternet.com"
 },
 {
   "name": "Gregory Mcdowel",
   "email": "gmdexec@gmail.com"
 },
 {
   "name": "Lisa Service",
   "email": "servicelisa85@gmail.com"
 },
 {
   "name": "Patrick Creighton",
   "email": "patrick.creighton@gmail.com"
 },
 {
   "name": "Phillip McGonigle",
   "email": "phillipmcgonigle@gmail.com"
 },
 {
   "name": "Strange New Worlds Season 5 Production Office",
   "email": "taylordapc@gmail.com"
 },
 {
   "name": "Duke Ross",
   "email": "dukerossfilms@gmail.com"
 },
 {
   "name": "John Dowdle",
   "email": "jedowdle@hey.com"
 }
]


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
        @inject(CommonService) public commonService: CommonService,
        @inject(GoogleService) public googleService: GoogleService,
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

        //get history
        var history: any = await this.apisService.getProductionHistory(production_id);
        //console.log('history', history);

        users.forEach((x: any, i: number) => {
            x.ctr = i + 1;
            x.usage_percentage = x.usage_percentage != null ? (x.usage_percentage + '%'):'';
            //console.log('last_login_date', x.last_login_date);
        });

        //parse activity texts
        for (let item of activity){
            if (item.action == 'new-assignment') {
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
            date: displayDate,
            history: history.history
        }

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
                    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
                    //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage' // Vital for low-memory Docker containers
                    ]
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
            .text-sm { font-size: 14px; }
            .month-row { background-color: #334155; color: white; padding:10px; margin:10px 0;}
            .bg-white { background: white; color: #334155;}
            
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
                    <th class="truncate max-w-180">Last Login</th>
                    <th class="truncate max-w-180">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {{#each users}}
                  <tr>
                    <td class="truncate max-w-160">{{this.ctr}}</td>
                    <td class="truncate max-w-140"><strong>{{this.first_name}}&nbsp;{{this.last_name}}</strong></td>
                    <td class="truncate max-w-180"><span style="color: #64748b;">{{this.production_email}}</span></td>
                    <td class="truncate max-w-180">{{this.last_login_date}}</td>
                    <td class="truncate max-w-180">{{ this.usage_percentage }}</td>
                  </tr>
                  {{/each}}
                </tbody>
              </table>
            </div>
          </div>

          <div class="section">
              <div class="section-header">Production Timeline</div>
              
              <div class="bg-white p-8">
                {{#each history}}
                  <div class="month-row">
                    <strong>{{this.month}}&nbsp;{{this.year}}</strong>&nbsp;&nbsp;|&nbsp;&nbsp;{{this.count}}&nbsp;Users&nbsp;({{this.change}})
                  </div>  
                    {{#each this.added}}
                      <div class="bg-white text-sm">{{this.ctr}}.&nbsp;Added
                        <em>{{this.first_name}}&nbsp;{{this.last_name}}</em>&nbsp;&nbsp;&nbsp;{{this.assignment_start_date}}
                      </div>
                    {{/each}}
                    {{#each this.removed}}
                      <div class="bg-white text-sm">{{this.ctr}}.&nbsp;Removed
                        <em>{{this.first_name}}&nbsp;{{this.last_name}}</em>&nbsp;&nbsp;&nbsp;{{this.assignment_end_date}}
                      </div>
                   {{/each}}
                {{/each}}
             </div>
          </div>
        </body>
      </html>
    `;
    //<td class="truncate max-w-180">{{this.personal_email}}</td>
        const template = handlebars.compile(templateSource);

        const final_html = template(data);
        //console.log('final_html', final_html);
        return final_html;
    }

    public async uploadUsersFromCSV(filePath:string, run_id:number, type:string): Promise<any> {
      
    var new_usersx = await this.getUsersInDocument(filePath) as any[];
  
    //map CSV data
    var new_users = new_usersx.map((x:any) => {
      return {
        first_name: x['First Name [Required]'],
        last_name: x['Last Name [Required]'],
        personal_email: x['Email Address [Required]'],
        org_unit_path: x['Org Unit Path [Required]']
      }
    });

    //console.log('new_users', new_users);

    //check that all productions exist
    var productions = await this.apisService.getProductions();

    this.apisService.updateBulkUploadRun(run_id, "Validating productions...");

    //check production and set domain for each user
    var non_existing_productions:any[] = [];
    new_users.forEach((user:any) => {
      //find production
      var record = productions.find((x:any) => {
        //console.log('x.name', x.name);
        if (!x.name) return false;
        return x.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') == user.org_unit_path.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'')
      });

      if(record){
        //console.log('record found', user.org_unit_path);
        user.domain = record.domain;
        user.production = record.name;
      }
      else{
        //console.log('not found', user.org_unit_path);
        non_existing_productions.push(user.org_unit_path);
      }

    });

    //console.log('new_users', new_users);

    //var users = await this.apisService.getUsers();
    
    
    //var already_existing_users:any[] = [];

    /*
    new_users.forEach((user:any) => {
      //find production
      var record = productions.find((x:any) => {
        //console.log('x.name', x.name);
        if (!x.name) return false;
        return x.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') == user.production.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'')
      });
      if (!record) non_existing_productions.push(user.production);
    */
      //find existing user
      /*
      var existing_user = users.find((x:any) => { 
        if (!x.personal_email) return false;
        return x.personal_email.toLowerCase() == user.email.toLowerCase()
      });
      if (existing_user) already_existing_users.push(existing_user.personal_email);
      */
    //});

    console.log('non_existing_productions', non_existing_productions);
    //console.log('already_existing_users', already_existing_users);

    
    if (non_existing_productions.length > 0) {
      return {
        error: 'Can not perform bulk addition because the following productions do not exist: ' + non_existing_productions
      }
    }

    var ctr = 0;
      if (type == 'current') {
        for (let user of new_users) {
          //add user to google
          var google_response = await this.googleService.addUserToGoogle(user);
          ctr += 1;
          this.apisService.updateBulkUploadRun(run_id, `Completing ${ctr} of ${new_users.length}...`);
        }
      }
      else if (type == 'past'){
        for (let user of new_users) {
         
          var response = await this.apisService.addUser(user);
          ctr += 1;
          this.apisService.updateBulkUploadRun(run_id, `Completing ${ctr} of ${new_users.length}...`);
        }
      }

    //after a bulk import, sync data
    //this.apisService.updateBulkUploadRun(run_id, `Syncing all data...`);
    //await this.googleService.syncGoogleData();

    this.apisService.updateBulkUploadRun(run_id, `Completed.`);
    /*
    if (already_existing_users.length > 0) {
      return {
        error: 'Can not perform bulk addition because users with the following personal emails already exist: ' + already_existing_users
      }
    }
    */


    return new_users.length;
  }

  public async getUsersInDocument(filePath:string){
    const new_users:any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ bom: true })) // <--- Add this option here
        .on('data', (row:any) => {
          // Optional: Transform or validate row data here
          //sanitized to removed quotes from header names
          const sanitizedRow:any = {};
          for (let key in row) {
            const cleanKey = key.replace(/^\ufeff/, '');
            sanitizedRow[cleanKey] = row[key];
          }
          
          new_users.push(sanitizedRow);
          
        })
        .on('end', async () => {
          try {
            if (new_users.length === 0) return resolve(0);
            else{
              //console.log('new_users',new_users);

              // Cleanup: remove the temp file from /uploads
              fs.unlinkSync(filePath);
              return resolve(new_users)
            }

            //resolve(result.affectedRows);
          } catch (err) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            reject(err);
          }
        })
        .on('error', (err:any) => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          reject(err);
        });
    });
  }

  public async getPastUsers(){

    var filePath = 'C:/Users/aikid/Documents/balboa_server/src/temp/Book_2024_2025.csv'
    const new_users:any[] = [];

    var users_in_db = await this.apisService.getUsers();
    var productions_in_db = await this.apisService.getProductions();
    var assignments_in_db = await this.apisService.getProductionAssignments();
    //console.log('users_in_db[0]',users_in_db[0]);

   

    return new Promise((resolve, reject) => {
      var users_not_in_db:any = [];
      var productions_not_in_db:any = [];
      var production = '';
      fs.createReadStream(filePath)
        .pipe(csv({ bom: true })) // <--- Add this option here
        .on('data', (row:any) => {
          // Optional: Transform or validate row data here
          //sanitized to removed quotes from header names
          const sanitizedRow:any = {};
          for (let key in row) {
            const cleanKey = key.replace(/^\ufeff/, '');
            sanitizedRow[cleanKey] = row[key];
          }

          var dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/;
          
          if (sanitizedRow['Production'] && !dateRegex.test(sanitizedRow['Production']) && sanitizedRow['Production'].indexOf('Total') == -1) production = sanitizedRow['Production'];
          sanitizedRow['Production'] = production;

          if (sanitizedRow['Production'] == 'Ivory Tower / Star Fleet') sanitizedRow['Production'] = 'Ivory Tower Star Fleet Academy (S1)';
          if (sanitizedRow['Production'] == '*') sanitizedRow['Production'] = 'The Department - The Agency';
          if (sanitizedRow['Production'] == 'The Donovans / Fixer') sanitizedRow['Production'] = 'The Donovans - Fixer CMG (S1)';
          if (sanitizedRow['Production'] == 'Mobland - Fixer S2') sanitizedRow['Production'] = 'Mobland S2 - Fixer S2';
          if (sanitizedRow['Production'] == 'Star Trek Strange New World S5 PO# 050030') sanitizedRow['Production'] = 'Star Trek: Strange New Worlds (S5)';
          if (sanitizedRow['Production'] == 'Yellowstone Procedural / Y: Marshals') sanitizedRow['Production'] = 'Yellowstone Procedural - Y Marshal';
          //if (sanitizedRow['Production'] == '1923 S2') sanitizedRow['Production'] = '1923 (S2)';

          if (sanitizedRow['Date Added'].indexOf('Moved') > -1) {
            //console.log('bad row', sanitizedRow);
            var records = new_users.filter((x:any) => { return (x['First name'] == sanitizedRow['First name']) && (x['Last name'] == sanitizedRow['Last name']); });
            if (records.length > 0) sanitizedRow['Date Added'] = records[records.length-1]['Date Added'];
            //console.log('fixed', sanitizedRow);
          }

          new_users.push(sanitizedRow);
          
        })
        .on('end', async () => {
          try {
            if (new_users.length === 0) return resolve(0);
            else{
              
              var new_usersx = new_users.filter((x:any) => { return x['Production'] && x['First name'] && x['Last name'] && x['Date Added'] && x['Date Remove']});
              var users:any[] = [];

              //console.log('new_usersx', new_usersx.length);

              new_usersx.forEach((x:any) => {
                //see if user is not already there
                var record = users.find((n:any) => { return (n.first_name == x['First name']) && n.last_name == x['Last name']});
                
                if (record){

                  //console.log(x,record);

                  record.str += ', ' + (x['Production'] + `(${x['Date Added']}-${x['Date Remove']})`);

                  //find production in db
                  //return x.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') == org_unit.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') 
                  var production_record = productions_in_db.find((n:any) => { return n.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') ==  x['Production'].toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'')});
                  if (production_record) console.log('production exists!', x['Production']);
                  else {
                    //console.log('production does not exists!', x['Production']);
                    
                    
                    if (productions_not_in_db.indexOf(x['Production']) == -1) productions_not_in_db.push(x['Production']);
                  }

                  record.assignments.push({
                    production: x['Production'],
                    start_date: x['Date Added'],
                    end_date: x['Date Remove']
                  })
                }
                else{

                  //see if user exists in application

                  var user_record = users_in_db.find((n:any) => { return (n.first_name.trim() == x['First name'].trim() && n.last_name.trim() == x['Last name'].trim()); });
                  if (user_record) console.log('user exists!');
                  else {
                    //console.log('user doesnt exits');
                    users_not_in_db.push(x);
                  }

                  var production_record = productions_in_db.find((n:any) => { return n.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') ==  x['Production'].toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'')});
                  if (production_record) console.log('production exists!', x['Production']);
                  else {
                    //console.log('production does not exists!', x['Production']);
                    if (productions_not_in_db.indexOf(x['Production']) == -1) productions_not_in_db.push(x['Production']);
                  }

                  users.push({
                    first_name: x['First name'],
                    last_name: x['Last name'],
                    str: (x['Production'] + `(${x['Date Added']}-${x['Date Remove']})`),
                    exists_in_db: user_record ? true:false,
                    assignments: [
                      {
                        production: x['Production'],
                        start_date: x['Date Added'],
                        end_date: x['Date Remove']
                      }
                    ]
                  })
                }
              })
              
              //console.log('users',users.length);
              console.log('users_not_in_db', users_not_in_db.length);
              for (let x of users_not_in_db){
                //console.log(i+1,',',x['First name'] + ' ' + x['Last name'],', ' + x['Production']);

                //resolve with list of personal emails
                var recordx = past_users_emails.find((n:any) => { return n.name.trim() == (x['First name'] + ' ' + x['Last name']).trim()});
                if (recordx) {
                  console.log('found!');
                  //add record to database
                  var user_record = {
                    first_name: x['First name'].trim(),
                    last_name: x['Last name'].trim(),
                    prodution_email: x['Email address'].trim(),
                    personal_email: recordx.email,
                    status: 'removed',
                    notes: x['Notes']
                  }

                  console.log('user_record', user_record);
                  //await this.apisService.addUser(user_record);
                  console.log('added user!')

                }
                else console.log('not found', x['First name'] + ' ' + x['Last name']);

              };

              console.log('users_not_in_db[0]',users_not_in_db[0]);

              console.log('productions_not_in_db');
              productions_not_in_db.forEach((x:any,i:number) => {
                console.log(i+1,',',x);
              });

              //console.log('users', users);

              console.log('---------------');
              for (let item of users){

                //find user in database
                var userx = users_in_db.find((x:any) => { return x.first_name.trim() == item.first_name.trim() && x.last_name.trim() == item.last_name.trim()});
                if (userx) {
                  console.log('found user!');
                  for (let assignment of item.assignments){
                    //find productions
                    var productionx = productions_in_db.find((n:any) => { return n.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') ==  assignment.production.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'')});
                    if (productionx) {
                      console.log('found production!');

                      //try to find assignment
                      var assignmentx = assignments_in_db.find((n:any) => { return n.user_id == userx.user_id && n.production_id == productionx.production_id;});
                      if (assignmentx) console.log('assignment already exists!');
                      else {
                        console.log('assignment does not exist', userx.first_name, userx.last_name, productionx.name);
                      
                        

                      //add assignment
                      var assignment_object = {
                        user_id: userx.user_id,
                        production_id: productionx.production_id,
                        start_date: assignment.start_date,
                        end_date: assignment.end_date,
                        status: 'inactive'
                      }

                      console.log('assignment_object', assignment_object);
                      //await this.apisService.addProductionAssignment(assignment_object);
                      console.log('####### added assignment!')
                    
                    }
                      //
                    }
                    else console.log('not found production', assignment.production);
                  }
                }
                else console.log('not found', item.first_name, item.last_name);

              }

              // Cleanup: remove the temp file from /uploads
              //fs.unlinkSync(filePath);
              return resolve(new_users)
            }

            //resolve(result.affectedRows);
          } catch (err) {
            //if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            reject(err);
          }
        })
        .on('error', (err:any) => {
          //if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          reject(err);
        });
    });
  }

}

// Export as a singleton for use across your application
//export const productionReportService = new ProductionReportService();