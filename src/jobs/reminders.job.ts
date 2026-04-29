import cron from 'node-cron';
import { pool } from '../database.config';
import { CommonService } from '@/services/common.service';
import { SendGridService } from '@/services/sendgrid.service';
import { ApisService } from '@/services/apis.service';
import { ApisRepository } from '@/repositories/apis.repository';
import { EmailNotificationsRepository } from '@/repositories/email_notifications.repository';
import { EmailNotificationsService } from '@/services/email_notifications';


// 1. Create the repository
const apisRepository = new ApisRepository(pool);
const emailNotificationsRepository = new EmailNotificationsRepository(pool);

var commonService = new CommonService;
var sendgridService = new SendGridService(commonService);
var emailNotificationsService = new EmailNotificationsService(emailNotificationsRepository);

// 2. Create the service by passing the repository into the constructor
const apisService = new ApisService(apisRepository, commonService, sendgridService, emailNotificationsService);

// It's best practice to wrap the job in a function or class
export const accountLoginReminders = () => {
    // Run every day at 4:00 AM
    cron.schedule('0 4 * * *', async () => {
        console.log('[Job] Account Login Reminders...');
        try {
            await apisService.accountLoginReminders();
            console.log('[Job] Account login reminders completed successfully.');
        } catch (error) {
            console.error('[Job Error] Account login reminders failed:', error);
        }
    });
};