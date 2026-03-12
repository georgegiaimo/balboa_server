import { Pool } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
export interface ISystemRepository {
    getConfiguration(): Promise<any>;
    updateConfiguration(object: any): Promise<any>;
}
export declare class SystemRepository implements ISystemRepository {
    private db;
    constructor(db: Pool);
    getConfiguration(): Promise<RowDataPacket[]>;
    updateConfiguration(object: any): Promise<any>;
}
