import { CommonService } from './common.service';
export declare class SendGridService {
    commonService: CommonService;
    constructor(commonService: CommonService);
    notificationOfAdminInvitation(data: any): Promise<void>;
    resetPassword(data: any): Promise<void>;
    sendEmail(msg: any): Promise<{
        success: boolean;
    }>;
}
