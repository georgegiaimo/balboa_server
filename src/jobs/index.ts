import { initGoogleSync } from './google_sync.job';

export const initializeCronJobs = () => {
  initGoogleSync();
  
  console.log('✅ All cron jobs have been initialized.');
};