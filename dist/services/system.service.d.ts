import { type ISystemRepository } from '../repositories/system.repository';
export declare class SystemService {
    private systemRepository;
    constructor(systemRepository: ISystemRepository);
    getConfiguration(): Promise<any[]>;
    updateConfiguration(data: any): Promise<any>;
}
