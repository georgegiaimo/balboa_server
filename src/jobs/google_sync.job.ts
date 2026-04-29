import cron from 'node-cron';
import { GoogleService } from '../services/google.service';
import { GoogleRepository } from '../repositories/google.repository'; // Import the missing piece
import { pool } from '../database.config';
import { CommonService } from '@/services/common.service';
import { SendGridService } from '@/services/sendgrid.service';
import { ApisService } from '@/services/apis.service';
import { EmailNotificationsService } from '@/services/email_notifications';
import { EmailNotificationsRepository } from '@/repositories/email_notifications.repository';


// 1. Create the repository
const googleRepository = new GoogleRepository(pool);
const emailNotificationsRepository = new EmailNotificationsRepository(pool);

var commonService = new CommonService;
var sendgridService = new SendGridService(commonService);
var emailNotificationsService = new EmailNotificationsService(emailNotificationsRepository);

// 2. Create the service by passing the repository into the constructor
const googleService = new GoogleService(googleRepository, commonService, sendgridService, emailNotificationsService);

// It's best practice to wrap the job in a function or class
export const initGoogleSync = () => {
    // Run every day at 3:00 AM
    cron.schedule('0 3 * * *', async () => {
        console.log('[Job] Starting Daily Sync Task...');
        try {
            await googleService.syncGoogleData();
            console.log('[Job] Daily Sync Task completed successfully.');
        } catch (error) {
            console.error('[Job Error] Daily Sync Task failed:', error);
        }
    });
};