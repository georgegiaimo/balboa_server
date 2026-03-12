"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtableService = void 0;
const airtable_repository_1 = require("../repositories/airtable.repository");
const _config_1 = require("../config/env.js");
const airtable_1 = __importDefault(require("airtable"));
const tsyringe_1 = require("tsyringe");
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
let AirtableService = class AirtableService {
    constructor(airtableRepository) {
        this.airtableRepository = airtableRepository;
        this.getAirtableDataCoordinators = async () => {
            // Initialize the Airtable client
            const base = new airtable_1.default({ apiKey: _config_1.AIRTABLE_PERSONAL_ACCESS_TOKEN }).base('appyWrdn6sMg0Pf75');
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
                    };
                    console.log('object', object);
                    console.log(this.airtableRepository);
                    this.airtableRepository.addCoordinator(object);
                }
                ;
                return data;
            }
            catch (error) {
                console.error('Error fetching from Airtable:', error);
                throw error;
            }
        };
        this.getAirtableDataUsers = async () => {
            // Initialize the Airtable client
            const base = new airtable_1.default({ apiKey: _config_1.AIRTABLE_PERSONAL_ACCESS_TOKEN }).base('appyWrdn6sMg0Pf75');
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
                var record_without_airtable_id = users.filter((x) => { return !x.airtable_id; });
                console.log(record_without_airtable_id.length);
                console.log(record_without_airtable_id);
                for (let user of users) {
                    var record = airtable_users.find((x) => {
                        //return x.fields['Personal Email'] == user.personal_email || x.fields['Email'] == user.personal_email;
                        return ((x.fields['Production Email'] == user.production_email) && !user.airtable_id);
                    });
                    if (record) {
                        //console.log(record.fields['Personal Email'], user.personal_email);
                        console.log(record, user);
                        var user_object = {
                            user_id: user.user_id,
                            airtable_id: record.id
                        };
                        console.log('user_object', user_object);
                        found += 1;
                        //await this.airtableRepository.updateUser(user_object);
                    }
                    else
                        not_found += 1;
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
                    };
                    console.log('object', object);
                    console.log(this.airtableRepository);
                    this.airtableRepository.addCoordinator(object);
                }
                ;
                return data;
            }
            catch (error) {
                console.error('Error fetching from Airtable:', error);
                throw error;
            }
        };
    }
    //constructor(@inject(ChatRepository) private chatRepo: ChatRepository) {}
    async getAirtableDataProductions() {
        // Initialize the Airtable client
        const base = new airtable_1.default({ apiKey: _config_1.AIRTABLE_PERSONAL_ACCESS_TOKEN }).base('appyWrdn6sMg0Pf75');
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
            for (let x of data) {
                //var assignments = x.fields['Assignments 4'];
                //if (assignments) console.log('assignments.length', assignments.length);
                //else console.log('not found');
                var object = {
                    name: x.fields['Project Name'],
                    status: x.fields['Production Status'],
                    domain: x.fields['Domains']?.[0],
                    type: x.fields['Type'],
                    number_of_episodes: x.fields['Episodes'],
                    //coordinator: x.fields['Coordinator'],
                    end_date: x.fields['Ends'],
                    created_timestamp: new Date(x.fields['Created']).getTime(),
                    airtable_id: x.id
                };
                //console.log('object', object);
                var production_id = await this.airtableRepository.addProduction(object);
                console.log('added production_id', production_id);
                //
                if (x.fields['Coordinator']) {
                    var record_coordinators = x.fields['Coordinator'];
                    for (let n of record_coordinators) {
                        //find in coordinators in table
                        var coordinatorx = coordinators.find((m) => { return m.airtable_id == n; });
                        if (coordinatorx) {
                            console.log('found!', coordinatorx);
                            var coordinator_assignment_object = {
                                production_id: production_id,
                                coordinator_id: coordinatorx.coordinator_id,
                                status: coordinatorx.status
                            };
                            await this.airtableRepository.addCoordinatorAssignment(coordinator_assignment_object);
                        }
                        else
                            console.log('not found!');
                    }
                    ;
                }
            }
            ;
            return data;
        }
        catch (error) {
            console.error('Error fetching from Airtable:', error);
            throw error;
        }
    }
};
exports.AirtableService = AirtableService;
exports.AirtableService = AirtableService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(airtable_repository_1.AirtableRepository)),
    __metadata("design:paramtypes", [Object])
], AirtableService);
//# sourceMappingURL=airtable.service.js.map