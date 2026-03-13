import { injectable, inject, delay } from 'tsyringe';
import axios from 'axios';
import { GoogleRepository, IGoogleRepository } from '@/repositories/google.repository';
//import { ChatRepository } from '@repositories/chat.repository';
const { JWT } = require('google-auth-library');
//const keys = require('../../airtable-integration-471002-dbb2e4afc3d1.json'); // Your downloaded JSON key
//const keys2 = require('../../airtable-sync-470518-c63c95099ebd.json'); // Your downloaded JSON key
// The structure of an individual User object from Google
const encodedCreds1 = process.env.GOOGLE_KEYS_CREWTV;
const encodedCreds2 = process.env.GOOGLE_KEYS_MOUNT22PROD;

var keys:any;
var keys2:any;

if (encodedCreds1) {
  // Turn the Base64 string back into a JSON object
  const decodedJson1 = Buffer.from(encodedCreds1, 'base64').toString('utf-8');
  keys = JSON.parse(decodedJson1);
  //console.log('keys', keys);
}

if (encodedCreds2) {
  // Turn the Base64 string back into a JSON object
  const decodedJson2 = Buffer.from(encodedCreds2, 'base64').toString('utf-8');
  keys2 = JSON.parse(decodedJson2);
  //console.log('keys2', keys2);
}

export interface GoogleUser {
    id: string;
    primaryEmail: string;
    name: {
        fullName: string;
    };
    emails?: Array<{
        address: string;
        type: string;
        primary?: boolean;
    }>;
    aliases?: string[];
    orgUnitPath: string;
    creationTime: string;
    lastLoginTime: string;
}

// The structure of the paginated API response
export interface GoogleDirectoryResponse {
    users?: GoogleUser[];
    nextPageToken?: string;
}

@injectable()
export class GoogleService {

    constructor(@inject(GoogleRepository) private googleRepository: IGoogleRepository) { }

    public async getAccessToken(domain_keys:any, subject_email:string) {

        const client = new JWT({
            email: domain_keys.client_email,
            key: domain_keys.private_key,
            // The email of a Workspace Admin you are impersonating
            subject: subject_email,//'admin@crew-tv.com',
            scopes: [
                'https://www.googleapis.com/auth/admin.directory.user.readonly',
                'https://www.googleapis.com/auth/admin.directory.orgunit'
            ],
        });

        try {
            // This gets the token (and handles caching/refreshing internally)
            const tokenResponse = await client.getAccessToken();

            //console.log('tokenResponse', tokenResponse);
            return tokenResponse.token;
        } catch (err) {
            console.error('Failed to get access token:', err);
            throw err;
        }
    }

    public async getUsersFromDirectory(
        access_token: string,
        pageToken: string
    ): Promise<GoogleDirectoryResponse> {

        

        const customerId = 'my_customer';
        const baseUrl = 'https://admin.googleapis.com/admin/directory/v1/users';

        // Construct parameters
        const params = new URLSearchParams({
            customer: customerId,
            maxResults: '500',
            projection: 'full',
            fields: 'users(id,primaryEmail,emails,aliases,name/fullName,orgUnitPath,organizations,creationTime,lastLoginTime),nextPageToken'
        });
//id,primaryEmail,emails,aliases,name/fullName,orgUnitPath,creationTime,lastLoginTime
        if (pageToken) {
            params.append('pageToken', pageToken);
        }

        //console.log(`${baseUrl}?${params.toString()}`);

        try {
            const response = await axios.get<GoogleDirectoryResponse>(`${baseUrl}?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Accept': 'application/json'
                }
            });

            // TypeScript now knows 'response.data' has 'users' and 'nextPageToken'
            //console.log('response.data', response.data);
            return response.data;

        } catch (error: any) {
            
            if (axios.isAxiosError(error)) {
                
                console.error('Google API Error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected Error:', error);
            }
            throw error;
        }
    }
/*
    public async getAllUsersFromDirectory(): Promise<any[]> {

    //for crewtv
    //var access_token = await this.getAccessToken();
    //for mount22prod
    var access_token = await this.getAccessToken2();

    let allUsers: any[] = [];
    let page_token: string | undefined = '';

    do {
        // 1. Fetch the current page
        const response: GoogleDirectoryResponse = await this.getUsersFromDirectory(access_token, page_token);
        
        // 2. Add these users to our master list
        if (response.users) {
            allUsers = allUsers.concat(response.users);
        }

        //console.log('response', response);
        // 3. Update the token for the next loop
        page_token = response.nextPageToken;

        console.log(`Fetched ${allUsers.length} users so far...`, page_token);



    } while (page_token); // Keep going as long as Google gives us a nextPageToken

    var google_users = allUsers;

    var productions = await this.googleRepository.getProductions();
    var users = await this.googleRepository.getUsers();


    var i = 0;
    var found = 0;
    var not_found = 0;
    var org_not_found:any[] = [];
    for (let x of users){

        //find equivalent in google
        var record = google_users.find((n:any) => { return n.id == x.google_id});

        if (record){
            //find production in productions
            var production = productions.find((n:any) => {
                return n.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') == record.orgUnitPath.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'');
            });
            if (production){

                /*
                var object = {
                    production_id: production.production_id,
                    org_unit_path: record.orgUnitPath
                }

                await this.googleRepository.updateProduction(object);
                */
      /*          
                //create assignment
                var assignment = {
                    production_id: production.production_id,
                    user_id: x.user_id,
                    status: 'active'
                }

                await this.googleRepository.addProductionAssignment(assignment);

            }
            else {
                //if (org_not_found.indexOf(record.orgUnitPath) == -1) org_not_found.push(record.orgUnitPath);
                //console.log(record.orgUnitPath, 'not found');
                
                //create production
                var production_object = {
                    name: record.orgUnitPath.slice(1),
                    org_unit_path: record.orgUnitPath,
                    created_timestamp: Date.now()
                }
                
                var production_id = await this.googleRepository.addProduction(production_object);
                productions = await this.googleRepository.getProductions();

                //create assignment
                var assignment2 = {
                    production_id: production_id,
                    user_id: x.user_id,
                    status: 'active'
                }

                await this.googleRepository.addProductionAssignment(assignment2);


            }
        }
        else not_found += 1;

       

        /*
        var name_tags = x.name.fullName.split(' ');
        var first_name = name_tags[0];
        var last_name =  name_tags[1] + (name_tags[2] ? (' ' + name_tags[2]):'') + (name_tags[3] ? (' ' + name_tags[3]):'') + (name_tags[4] ? (' ' + name_tags[4]):'');
        
        var user_object = {
            google_id: x.id,
            first_name: first_name,
            last_name: last_name, 
            email_production: x.primaryEmail,
            last_login_time: new Date(x.lastLoginTime).getTime(),
            creation_time: new Date(x.creationTime).getTime(), 
            email_personal: x.emails[0] ? x.emails[0].address:'',
            //org_unit_path: x.orgUnitPath
        }
        */

        //await this.googleRepository.addUser(user_object);
/*
        i +=1;
        console.log('user_object', i);

    }

     console.log('org_not_found', org_not_found);

    return allUsers;
}
*/
/*
    public async getAccessToken2() {
        const client = new JWT({
            email: keys2.client_email,
            key: keys2.private_key,
            // The email of a Workspace Admin you are impersonating
            subject: 'admin@mount22prod.com',
            scopes: [
                'https://www.googleapis.com/auth/admin.directory.user.readonly',
                'https://www.googleapis.com/auth/admin.directory.orgunit'
            ],
        });

        try {
            // This gets the token (and handles caching/refreshing internally)
            const tokenResponse = await client.getAccessToken();

            console.log('tokenResponse', tokenResponse);
            return tokenResponse.token;
        } catch (err) {
            console.error('Failed to get access token mountProd22:', err);
            throw err;
        }
    }
        */

     public async getOrganizationalUnits(access_token:string): Promise<GoogleDirectoryResponse> {

        //var access_token = await this.getAccessToken();


        const customerId = 'my_customer';
        const url = `https://admin.googleapis.com/admin/directory/v1/customer/${customerId}/orgunits`;

        
        try {
            const response = await axios.get<GoogleDirectoryResponse>(url, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Accept': 'application/json'
                }
            });

            // TypeScript now knows 'response.data' has 'users' and 'nextPageToken'
            //console.log('response.data', response.data);

            return response.data;

        } catch (error: any) {
            
            if (axios.isAxiosError(error)) {
                
                console.error('Google API Error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected Error:', error);
            }
            throw error;
        }
    }

    /*
    public async addMissingProductions(){
        var google_response = await this.getOrganizationalUnits() as any;
        var google_productions = google_response.organizationUnits;

        var response = await this.googleRepository.getProductions();
        var productions = response;

        var found = 0;
        var not_found = 0;
        for (let org_unit of google_productions){
            //see if can find that record in current database
            var record = productions.find((x:any) => { 
                return x.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') == org_unit.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') 
            });
            

            if (record) {
                console.log('org_unit', org_unit);
                console.log('record', record);
                found += 1
                var object = {
                    production_id: record.production_id,
                    google_org_unit_id: org_unit.orgUnitId,
                    google_org_unit_parent_id: org_unit.parentOrgUnitId,
                    name: org_unit.name,
                    org_unit_path: org_unit.orgUnitPath,
                    domain: 'crew-tv'
                }

                await this.googleRepository.updateProduction(object);
            }
            else {
                
                var object2 = {
                    google_org_unit_id: org_unit.orgUnitId,
                    google_org_unit_parent_id: org_unit.parentOrgUnitId,
                    name: org_unit.name,
                    org_unit_path: org_unit.orgUnitPath,
                    domain: 'crew-tv'
                }

                await this.googleRepository.addProduction(object2);

                not_found += 1;
            }
        }

        console.log('found', found, 'not_found', not_found);

    }
    */

    public async syncProductions(){

        //get token for crew-tv
        var access_token = await this.getAccessToken(keys, 'admin@crew-tv.com');
        var response1 = await this.getOrganizationalUnits(access_token) as any;
        var google_org_units_crew_tv = response1.organizationUnits;
        google_org_units_crew_tv.forEach((x:any) => {  x.domain = 'crew-tv'});
        
        //get token for mount22prod
        var access_token2 = await this.getAccessToken(keys2, 'admin@mount22prod.com');
        var response2 = await this.getOrganizationalUnits(access_token2) as any;
        var google_org_units_mount22prod = response2.organizationUnits;
        google_org_units_mount22prod.forEach((x:any) => {  x.domain = 'mount22prod'});
        
        var google_org_units = google_org_units_crew_tv.concat(google_org_units_mount22prod);

        //console.log('productions in google', google_org_units.length);
        //console.log('google_org_units[0]',google_org_units[0]);

        //1. Check that all production in Google exist in the productions database
        var productions = await this.googleRepository.getProductions();

        for (let org_unit of google_org_units){
            //see if can find that record in current database
            var record = productions.find((x:any) => { 
                //return x.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') == org_unit.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') 
                return x.google_org_unit_id == org_unit.orgUnitId;
            });
            
            if (record) {
                var object = {
                    production_id: record.production_id,
                    google_org_unit_id: org_unit.orgUnitId,
                    google_org_unit_parent_id: org_unit.parentOrgUnitId,
                    name: org_unit.name,
                    org_unit_path: org_unit.orgUnitPath,
                    domain: org_unit.domain
                }

                await this.googleRepository.updateProduction(object);
            }
            else {
                
                var object2 = {
                    google_org_unit_id: org_unit.orgUnitId,
                    google_org_unit_parent_id: org_unit.parentOrgUnitId,
                    name: org_unit.name,
                    org_unit_path: org_unit.orgUnitPath,
                    domain: org_unit.domain
                }

                console.log('production does not exist in db, creating ...', org_unit.name);
                await this.googleRepository.addProduction(object2);

            }
        }

        //2 Check if there are any productions in the database that are not in Google anymore
        //get newest list in case new productions were added
        var productions2 = await this.googleRepository.getProductions();
        for (let org_unit of google_org_units){
            //see if can find that record in current database
            var record = productions2.find((x:any) => { 
                //return x.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') == org_unit.name.toLowerCase().replace(/[()]/g,'').replace('/','').replace(/ /g,'') 
                return x.google_org_unit_id == org_unit.orgUnitId;
            });
            
            if (record) record.exists_in_google = true;
        }

        var deleted_productions = productions2.filter((x:any) => { return !x.exists_in_google; });

        for (let item of deleted_productions){
            var objectx = {
                production_id: item.production_id,
                status: 'removed'
            }

            console.log('production no longer in google, update record in db...', item.name);
            await this.googleRepository.updateProduction(objectx);
        }

    }

    public async syncUsers() {

        //get list of productions first
        //get token for crew-tv
        var access_token = await this.getAccessToken(keys, 'admin@crew-tv.com');
        var response1 = await this.getOrganizationalUnits(access_token) as any;
        var google_org_units_crew_tv = response1.organizationUnits;
        google_org_units_crew_tv.forEach((x:any) => {  x.domain = 'crew-tv'});
        
        //get token for mount22prod
        var access_token2 = await this.getAccessToken(keys2, 'admin@mount22prod.com');
        var response2 = await this.getOrganizationalUnits(access_token2) as any;
        var google_org_units_mount22prod = response2.organizationUnits;
        google_org_units_mount22prod.forEach((x:any) => {  x.domain = 'mount22prod'});
        
        var google_org_units = google_org_units_crew_tv.concat(google_org_units_mount22prod);


        //get token for crew-tv
        var access_token = await this.getAccessToken(keys, 'admin@crew-tv.com');
        var google_users_crew_tv = await this.getUsers(access_token);
        //get token for mount22prod
        var access_token2 = await this.getAccessToken(keys2, 'admin@mount22prod.com');
        var google_users_mount22prod = await this.getUsers(access_token2);

        var google_users = google_users_crew_tv.concat(google_users_mount22prod);

        google_users.forEach((user:any) => {
            //find org unit
            var org_unit = google_org_units.find((x:any) => {return x.orgUnitPath == user.orgUnitPath});
            if (org_unit) user.orgUnitId = org_unit.orgUnitId;
            else console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ can not find org unit path', user.orgUnitPath, user.name.fullName);
        });

        //console.log('users in google', google_users.length);
        //console.log('google_users[0]', google_users[0]);

             
        var productions = await this.googleRepository.getProductions();
        var users = await this.googleRepository.getUsers();

         for (let user_gg of google_users){

            var user_gg_personal_email = user_gg.emails[0] ? user_gg.emails[0].address:'';
            if (!user_gg_personal_email) continue;

            //see if can find that record in current database
            var record = users.find((x:any) => { 
                return x.personal_email.toLowerCase() == user_gg_personal_email.toLowerCase(); 
            });

            if (record){

                //update last login time if different
                if (record.last_login_time != new Date(user_gg.lastLoginTime).getTime()) {
                    var user_objectx = {
                        user_id: record.user_id,
                        last_login_time: new Date(user_gg.lastLoginTime).getTime()
                    }

                    await this.googleRepository.updateUser(user_objectx);
                }

                //check assignment
                var assignments = await this.googleRepository.getUserAssignments(record.user_id);
                
                //find current assignment
                var current_asignment = assignments.find((x:any) => { return x.assignment_status == 'active'});

                if (current_asignment){
                    if (current_asignment.google_org_unit_id == user_gg.orgUnitId){
                        //user assignment is ok
                    }
                    else {
                        //user has been given a new assignment
                        //1. Set all current assignments to 'inactive'
                        //2. Create new assignment for the current org unit path
                        for (let assignment of assignments){
                            var object = {
                                production_assignment_id: assignment.production_assignment_id,
                                status: 'inactive',
                                ended_timestamp: Date.now()
                            }

                            console.log('Update production assignment, inactive...', record.first_name, record.last_name, current_asignment.name);
                            await this.googleRepository.updateProductionAssignment(object);
                        }

                        //find new production
                        var production = productions.find((x:any) => { return x.org_unit_path == user_gg.orgUnitPath})


                        if (production) await this.addNewProductionAssignment(production, record);
                        else console.log('org unit not found in db', user_gg.orgUnitPath);

                    }
                }
                else {
                    console.log('assignment for user not found...');
                    var production = productions.find((x: any) => { return x.org_unit_path == user_gg.orgUnitPath });
                    if (production) await this.addNewProductionAssignment(production, record);
                }
            }
            else {
                console.log('user not found', user_gg.name.fullName);

                var name_tags = user_gg.name.fullName.split(' ');
                var first_name = name_tags[0];
                var last_name = name_tags[1] + (name_tags[2] ? (' ' + name_tags[2]) : '') + (name_tags[3] ? (' ' + name_tags[3]) : '') + (name_tags[4] ? (' ' + name_tags[4]) : '');

                var user_object = {
                    google_id: user_gg.id,
                    first_name: first_name,
                    last_name: last_name,
                    production_email: user_gg.primaryEmail,
                    last_login_time: new Date(user_gg.lastLoginTime).getTime(),
                    creation_time: new Date(user_gg.creationTime).getTime(),
                    personal_email: user_gg.emails[0] ? user_gg.emails[0].address : '',
                }

                console.log('adding new user', user_object.first_name, user_object.last_name);
                var user_id = await this.googleRepository.addUser(user_object);
                

                //find production based on user orgUnitPath value
                var productionx = productions.find((x:any) => { return x.org_unit_path == user_gg.orgUnitPath});
                if (productionx) await this.addNewProductionAssignment(productionx, {user_id: user_id});
                else console.log('org unit for new user not found in db', user_gg.orgUnitPath);

            }

        }

        //check for users that are in database but no longer in google
        var users2 = await this.googleRepository.getUsers();
        for (let user_gg of google_users){

            var user_gg_personal_email = user_gg.emails[0] ? user_gg.emails[0].address:'';
            if (!user_gg_personal_email) continue;

            //see if can find that record in current database
            var record = users2.find((x:any) => { 
                return x.personal_email.toLowerCase() == user_gg_personal_email.toLowerCase(); 
            });

            if (record) record.exists_in_google = true;
        }

        var deleted_users = users2.filter((x:any) => { return !x.exists_in_google; });

        for (let user of deleted_users){
            
            //check assignment
            var assignments = await this.googleRepository.getUserAssignments(user.user_id);
            
            //if any assignment still shows active, set to inactive
            var active_assignments = assignments.filter((x:any) => { return x.status == 'active'});

            for (let assignment of active_assignments){
                
                var objectn = {
                    production_assignment_id: assignment.production_assignment_id,
                    status: 'inactive',
                    ended_timestamp: Date.now()
                }

                console.log('user no longer in google, set assignemnt to inactive...', user.first_name, user.last_name, assignment.name);
                await this.googleRepository.updateProductionAssignment(objectn);
            }

        }

        //store historical data
        var historical_data_object = {
            users: google_users.length,
            productions: google_org_units.length,
            timestamp: Date.now()
        }

        await this.googleRepository.addHistoricalData(historical_data_object);

    }

    async addNewProductionAssignment(production: any, user: any) {

        if (production) {

            console.log('new assignment...', user.first_name, user.last_name, production.name);

            var new_assignment = {
                status: 'active',
                created_timestamp: Date.now(),
                user_id: user.user_id,
                production_id: production.production_id
            }

            console.log('Adding production assignment...');
            await this.googleRepository.addProductionAssignment(new_assignment);

        }
    }

    async getUsers(access_token:string){
        let allUsers: any[] = [];
        let page_token: string | undefined = '';

        do {
            // 1. Fetch the current page
            const response: GoogleDirectoryResponse = await this.getUsersFromDirectory(access_token, page_token);

            // 2. Add these users to our master list
            if (response.users) {
                allUsers = allUsers.concat(response.users);
            }

            //console.log('response', response);
            // 3. Update the token for the next loop
            page_token = response.nextPageToken;

            //console.log(`Fetched ${allUsers.length} users so far...`, page_token);



        } while (page_token); // Keep going as long as Google gives us a nextPageToken
        return allUsers;
    }

    async syncGoogleData(){
        console.log('------------------- Starting ---------------');
        await this.syncProductions();
        console.log('Finished sync productions...');
        await this.syncUsers();
        console.log('Finished sync users...');
    }


}
