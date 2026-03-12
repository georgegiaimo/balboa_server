import { IAirtableRepository } from '../repositories/airtable.repository';
export declare class AirtableService {
    private airtableRepository;
    constructor(airtableRepository: IAirtableRepository);
    getAirtableDataProductions(): Promise<any[]>;
    getAirtableDataCoordinators: () => Promise<any[]>;
    getAirtableDataUsers: () => Promise<any[]>;
}
