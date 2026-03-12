import { Pool } from 'mysql2/promise';
export interface IAirtableRepository {
    addCoordinator(object: any): Promise<any>;
    getCoordinators(): Promise<any>;
    addProduction(object: any): Promise<any>;
    addCoordinatorAssignment(object: any): Promise<any>;
    getUsers(): Promise<any>;
    addUser(object: any): Promise<any>;
    updateUser(object: any): Promise<any>;
}
export declare class AirtableRepository implements IAirtableRepository {
    private db;
    constructor(db: Pool);
    addCoordinator(object: any): Promise<any>;
    getCoordinators(): Promise<any>;
    addProduction(object: any): Promise<any>;
    addCoordinatorAssignment(object: any): Promise<any>;
    addUser(object: any): Promise<any>;
    getUsers(): Promise<any>;
    updateUser(object: any): Promise<any>;
}
