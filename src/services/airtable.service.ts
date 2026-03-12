import { AirtableRepository, IAirtableRepository } from '@/repositories/airtable.repository';
import { AIRTABLE_PERSONAL_ACCESS_TOKEN } from '@config';
import Airtable from 'airtable';
import { delay, inject, injectable } from 'tsyringe';

// Define the structure of your Airtable record
/*
export interface AirtableRecord {
  id: string;
  fields: {
    'Project Name'?: string;
    Status?: string;
    Email?: string;
    // Add your other Airtable field names here
  };
}
*/

@injectable()
export class AirtableService {
    constructor(@inject(AirtableRepository) private airtableRepository: IAirtableRepository) { }
    //constructor(@inject(ChatRepository) private chatRepo: ChatRepository) {}

    
    public async getAirtableDataProductions(): Promise<any[]> {
        // Initialize the Airtable client
        const base = new Airtable({ apiKey: AIRTABLE_PERSONAL_ACCESS_TOKEN }).base('appyWrdn6sMg0Pf75');

        try {
            // Select the table and fetch all records
            const records = await base('productions').select({
                // Optional: Add filters or sorting
                maxRecords: 100,
                view: "MAIN"
            }).all();

            // Map the complex Airtable objects into a clean array
            var data = records.map(record => ({
                id: record.id,
                fields: record.fields
            }));


            //get coordinators to generate assignments
            var coordinators = await this.airtableRepository.getCoordinators();
            //console.log('coordinators.length', coordinators.length);

            //data = data.slice(0,1);
            console.log('data', data[0]);
            console.log('data', data[1]);
            console.log('data', data[2]);
            console.log('data', data[3]);
            console.log('data', data[4]);
            console.log('data', data[5]);
            console.log('data', data[6]);
            


            
            for (let x of data){

                //var assignments = x.fields['Assignments 4'];
                //if (assignments) console.log('assignments.length', assignments.length);
                //else console.log('not found');

                
                var object = {
                    name: x.fields['Project Name'],
                    status: x.fields['Production Status'],
                    domain: (x.fields['Domains'] as any)?.[0],
                    type: x.fields['Type'],
                    number_of_episodes: x.fields['Episodes'],
                    //coordinator: x.fields['Coordinator'],
                    end_date: x.fields['Ends'],
                    created_timestamp: new Date(<string>x.fields['Created']).getTime(),
                    airtable_id: x.id
                }

                //console.log('object', object);

                var production_id = await this.airtableRepository.addProduction(object);
                console.log('added production_id', production_id);

                //
                if (x.fields['Coordinator']) {
                    var record_coordinators = x.fields['Coordinator'] as any[];

                    for (let n of record_coordinators){
                        //find in coordinators in table
                        var coordinatorx = coordinators.find((m: any) => { return m.airtable_id == n });
                        if (coordinatorx) {
                            console.log('found!', coordinatorx);

                            var coordinator_assignment_object = {
                                production_id: production_id,
                                coordinator_id: coordinatorx.coordinator_id,
                                status: coordinatorx.status
                            }
                            
                            await this.airtableRepository.addCoordinatorAssignment(coordinator_assignment_object);

                        }
                        else console.log('not found!')
                    };
                }
                
            };

            return data;

        } catch (error) {
            console.error('Error fetching from Airtable:', error);
            throw error;
        }
    }

    public getAirtableDataCoordinators = async (): Promise<any[]> => {
        // Initialize the Airtable client
        const base = new Airtable({ apiKey: AIRTABLE_PERSONAL_ACCESS_TOKEN }).base('appyWrdn6sMg0Pf75');

        try {
            // Select the table and fetch all records
            const records = await base('coordinators').select({
                // Optional: Add filters or sorting
                maxRecords: 100,
                view: "Grid view"
            }).all();

            // Map the complex Airtable objects into a clean array
            var data = records.map(record => ({
                id: record.id,
                fields: record.fields
            }));


            console.log('data', data[0]);
            console.log('data', data[1]);
            console.log('data', data[2]);
            console.log('data', data[3]);
            console.log('data', data[4]);
            console.log('data', data[5]);


           
            for (let x of data) {

                var object = {
                    airtable_id: x['id'],
                    first_name: x.fields['First Name'],
                    last_name: x.fields['Last Name'],
                    status: x.fields['Status'],
                    email: x.fields['Email'],
                }
                console.log('object', object);

                console.log(this.airtableRepository);
                this.airtableRepository.addCoordinator(object);

            };

            return data;

        } catch (error) {
            console.error('Error fetching from Airtable:', error);
            throw error;
        }
    }

    public getAirtableDataUsers = async (): Promise<any[]> => {
        // Initialize the Airtable client
        const base = new Airtable({ apiKey: AIRTABLE_PERSONAL_ACCESS_TOKEN }).base('appyWrdn6sMg0Pf75');

        try {
            // Select the table and fetch all records
            const records = await base('users').select({
                // Optional: Add filters or sorting
                view: "MAIN"
            }).all();

            // Map the complex Airtable objects into a clean array
            var data = records.map(record => ({
                id: record.id,
                fields: record.fields
            }));

            console.log('data.length', data.length);
            var airtable_users = data;

            //get users in database
            var users = await this.airtableRepository.getUsers();
            console.log('users.length', users.length);

            //find airtable match
            var found = 0;
            var not_found = 0;

            
            var record_without_airtable_id = users.filter((x:any) => { return !x.airtable_id});
            console.log(record_without_airtable_id.length);
            console.log(record_without_airtable_id);
            
            
            for (let user of users){
                var record = airtable_users.find((x:any) => {
                    //return x.fields['Personal Email'] == user.personal_email || x.fields['Email'] == user.personal_email;
                    return ((x.fields['Production Email'] == user.production_email) && !user.airtable_id)
                });

                if (record){
                    //console.log(record.fields['Personal Email'], user.personal_email);
                    console.log(record, user);
                    var user_object = {
                        user_id: user.user_id,
                        airtable_id: record.id
                    }

                    console.log('user_object', user_object);
                    found += 1;
                    //await this.airtableRepository.updateUser(user_object);
                }
                else not_found += 1;

            }
            
            console.log('found', found, 'not_found', not_found);


            /*
            console.log('data', data[0]);
            console.log('data', data[1]);
            console.log('data', data[2]);
            console.log('data', data[3]);
            console.log('data', data[4]);
            console.log('data', data[5]);
            console.log('data', data[6]);
            console.log('data', data[7]);
            */

            return [0];
            for (let x of data) {

                var object = {
                    airtable_id: x['id'],
                    first_name: x.fields['First Name'],
                    last_name: x.fields['Last Name'],
                    status: x.fields['Status'],
                    email: x.fields['Email'],
                }
                console.log('object', object);

                console.log(this.airtableRepository);
                this.airtableRepository.addCoordinator(object);

            };

            return data;

        } catch (error) {
            console.error('Error fetching from Airtable:', error);
            throw error;
        }
    }
}