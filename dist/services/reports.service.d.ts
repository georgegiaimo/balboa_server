import { IReportsRepository } from '../repositories/reports.repository';
import { CommonService } from './common.service';
export declare class ReportsService {
    private reportsRepository;
    private commonService;
    constructor(reportsRepository: IReportsRepository, commonService: CommonService);
    getDashboardData(): Promise<{
        productions: any;
        domains: {
            domain: string;
            users: number;
        }[];
        historical_data: any;
    }>;
}
