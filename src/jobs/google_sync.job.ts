import cron from 'node-cron';
import { GoogleService } from '../services/google.service';
import { GoogleRepository } from '../repositories/google.repository'; // Import the missing piece
import { pool } from '../database.config';


// 1. Create the repository
const googleRepository = new GoogleRepository(pool);

// 2. Create the service by passing the repository into the constructor
const googleService = new GoogleService(googleRepository);

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