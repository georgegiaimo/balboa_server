import { Pool } from 'mysql2/promise';
export interface IReportsRepository {
    getUsers(): Promise<any>;
    getProductions(): Promise<any>;
    getProductionAssignments(): Promise<any>;
    getHistoricalData(): Promise<any>;
}
export declare class ReportsRepository implements IReportsRepository {
    private db;
    constructor(db: Pool);
    getUsers(): Promise<any>;
    getProductionAssignments(): Promise<any>;
    getProductions(): Promise<any>;
    getHistoricalData(): Promise<any>;
}
