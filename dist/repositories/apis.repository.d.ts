import { Pool } from 'mysql2/promise';
export interface IApisRepository {
    getProductions(): Promise<any>;
    getProductionDetails(production_id: number): Promise<any>;
    getProductionAssignments(): Promise<any>;
    getCoordinators(): Promise<any>;
    getCoordinator(coordinator_id: number): Promise<any>;
    getCoordinatorAssignments(): Promise<any>;
    getAssignmentsByCoordinatorId(coordinator_id: number): Promise<any>;
    getProductionCoordinators(production_id: number): Promise<any>;
    getProductionUsers(production_id: number): Promise<any>;
    getUsers(): Promise<any>;
    getUserDetails(user_id: number): Promise<any>;
    getUserAssignments(user_id: number): Promise<any>;
    getAdmins(): Promise<any>;
    updateAdmin(admin: any): Promise<any>;
    getAdmin(admin_id: number): Promise<any>;
    getAdminByEmail(email: string): Promise<any>;
}
export declare class ApisRepository implements IApisRepository {
    private db;
    constructor(db: Pool);
    getProductions(): Promise<any>;
    getProductionAssignments(): Promise<any>;
    getProductionDetails(production_id: number): Promise<any>;
    getCoordinators(): Promise<any>;
    getCoordinatorAssignments(): Promise<any>;
    getProductionCoordinators(production_id: number): Promise<any>;
    getProductionUsers(production_id: number): Promise<any>;
    getUserDetails(user_id: number): Promise<any>;
    getUserAssignments(user_id: number): Promise<any>;
    getUsers(): Promise<any>;
    getAdmins(): Promise<any>;
    getAdmin(admin_id: number): Promise<any>;
    updateAdmin(object: any): Promise<any>;
    getAdminByEmail(email: string): Promise<any>;
    getCoordinator(coordinator_id: number): Promise<any>;
    getAssignmentsByCoordinatorId(coordinator_id: number): Promise<any>;
}
