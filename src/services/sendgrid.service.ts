import sgMail from '@sendgrid/mail';
import { CommonService } from './common.service';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SendGridService {
    
    constructor(
        @inject(CommonService) public commonService: CommonService
    ) {
        const apiKey = process.env.SENDGRID_API_KEY;
        if (apiKey) {
            sgMail.setApiKey(apiKey);
        } else {
            console.warn('SendGrid API Key is missing. Emails will not be sent.');
        }
    }

    async notificationOfAdminInvitation(data: any) {

        var link;
        if (process.env.ENVIRONMENT == 'development') link = 'http://localhost:4200/password-reset/' + data.password_reset_token;
        else link = 'https://askbalboa.com/password-reset/' + data.password_reset_token;

        var mailObj = {
            to: data.email,
            from: {
                email: "admin@askbalboa.com",
                name: "Balboa Computer"
            },
            templateId: "d-065b37506b1f4a7b9427dc8d78d2025b",
            dynamic_template_data: {
                name: data.first_name,
                link_url: link
            }
        }

        this.sendEmail(mailObj);
    }

    async resetPassword(data: any) {

        var link;
        if (process.env.ENVIRONMENT == 'development') link = 'http://localhost:4200/password-reset/' + data.password_reset_token;
        else link = 'https://askbalboa.com/password-reset/' + data.password_reset_token;

        var mailObj = {
            to: data.email,
            from: {
                email: "admin@askbalboa.com",
                name: "Balboa Computer"
            },
            templateId: "d-8a3c2f6ed31b4578843440a39ba71858",
            dynamic_template_data: {
                link_url: link
            }
        }

        this.sendEmail(mailObj);
    }


    async sendEmail(msg: any) {

        try {
            await sgMail.send(msg);
            console.log(`[Email Success]: Sent to ${msg.to}`);
            return { success: true };
        } catch (error: any) {
            console.error('[Email Error]:', error.response?.body || error.message);
            throw new Error('Failed to send email notification');
        }
    }

}
