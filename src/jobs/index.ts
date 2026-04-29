import { initGoogleSync } from './google_sync.job';
import { accountLoginReminders } from './reminders.job';

export const initializeCronJobs = () => {
  initGoogleSync();
  accountLoginReminders();
  console.log('✅ All cron jobs have been initialized.');
};