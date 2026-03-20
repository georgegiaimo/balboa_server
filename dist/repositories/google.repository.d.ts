import { Pool } from 'mysql2/promise';
export interface IGoogleRepository {
    addUser(object: any): Promise<any>;
    getUsers(): Promise<any>;
    updateUser(object: any): Promise<any>;
    getProductions(): Promise<any>;
    addProduction(object: any): Promise<any>;
    updateProduction(object: any): Promise<any>;
    addProductionAssignment(object: any): Promise<any>;
    getUserAssignments(id: number): Promise<any>;
    updateProductionAssignment(object: any): Promise<any>;
    addHistoricalData(object: any): Promise<any>;
    getProductionAssignments(): Promise<any>;
    deleteProductionAssignment(id: number): Promise<any>;
    addSnapshot(object: any): Promise<any>;
    addReportAction(object: any): Promise<any>;
}
export declare class GoogleRepository implements IGoogleRepository {
    private db;
    constructor(db: Pool);
    addUser(object: any): Promise<any>;
    getUsers(): Promise<any>;
    getProductions(): Promise<any>;
    addProduction(object: any): Promise<any>;
    updateProduction(object: any): Promise<any>;
    addProductionAssignment(object: any): Promise<any>;
    getUserAssignments(user_id: number): Promise<any>;
    updateProductionAssignment(object: any): Promise<any>;
    updateUser(object: any): Promise<any>;
    addHistoricalData(object: any): Promise<any>;
    getProductionAssignments(): Promise<any>;
    deleteProductionAssignment(production_assignment_id: number): Promise<any>;
    addSnapshot(object: any): Promise<any>;
    addReportAction(object: any): Promise<any>;
}
