import { IApisRepository } from '../repositories/apis.repository';
import { CommonService } from './common.service';
export declare class ApisService {
    private apisRepository;
    commonService: CommonService;
    constructor(apisRepository: IApisRepository, commonService: CommonService);
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
    addAdmin(first_name: string, last_name: string, email: string, role: string): Promise<any>;
    getAdmin(admin_id: number): Promise<any>;
    updateAdmin(object: any): Promise<any>;
    getCoordinators(): Promise<any>;
}
