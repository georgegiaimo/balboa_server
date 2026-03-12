import { SystemService } from './system.service';
export declare class ChatService {
    private systemService;
    constructor(systemService: SystemService);
    private client;
    processUserMessage(userId: string, message: string, contents: any[]): Promise<string | undefined>;
}
