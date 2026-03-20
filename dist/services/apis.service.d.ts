import { IApisRepository } from '../repositories/apis.repository';
import { CommonService } from './common.service';
import { SendGridService } from './sendgrid.service';
export declare class ApisService {
    private apisRepository;
    commonService: CommonService;
    sendgridService: SendGridService;
    constructor(apisRepository: IApisRepository, commonService: CommonService, sendgridService: SendGridService);
    getProductions(): Promise<any>;
    getProductionDetails(production_id: number): Promise<{
        production: any;
        users: any;
        coordinators: any;
    }>;
    getUserDetails(user_id: number): Promise<{
        user: any;
        assignments: any;
    }>;
    getUsers(): Promise<any>;
    getDomainDetails(domain: string): Promise<{
        users: any;
        productions: any[];
    }>;
    getAdmins(): Promise<any>;
    getAdmin(admin_id: number): Promise<any>;
    updateAdmin(object: any): Promise<any>;
    getCoordinators(): Promise<any>;
    getCoordinatorDetails(coordinator_id: number): Promise<{
        coordinator: any;
        assignments: any;
    }>;
    getHealth(): Promise<{
        duplicated_users_by_name: number;
        duplicated_users_by_email: number;
        unassigned_users: number;
        inactive_users: number;
        approaching_one_year: number;
    }>;
    getDuplicatedUsersByEmail(): Promise<any[]>;
    getDuplicatedUsersByName(): Promise<any[]>;
    getUnassignedUsers(): Promise<any>;
    getInactiveUsers(): Promise<any>;
    getSimilarByEmail(): Promise<any[]>;
    getSimilarByName(): Promise<any[]>;
    getApproachingOneYear(): Promise<any>;
    getLevenshteinDistance(a: string, b: string): number;
    getSimilarity(str1: string, str2: string, threshold?: number): number;
}
