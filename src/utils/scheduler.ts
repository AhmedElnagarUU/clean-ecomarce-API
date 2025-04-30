import { CleanupService } from '../modules/cleanup/cleanup.service';

const cleanupService = new CleanupService();

// Interval in milliseconds (24 hours)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;

/**
 * Process pending cleanup tasks on a schedule
 */
export const startCleanupScheduler = () => {
  console.log('Starting S3 cleanup scheduler');
  
  // Process immediately on startup
  processCleanupTasks();
  
  // Then schedule regular processing
  setInterval(processCleanupTasks, CLEANUP_INTERVAL);
};

/**
 * Process pending cleanup tasks
 */
async function processCleanupTasks() {
  try {
    console.log(`[${new Date().toISOString()}] Running scheduled cleanup task processing`);
    const stats = await cleanupService.getCleanupStats();
    
    if (stats.pending === 0) {
      console.log('No pending cleanup tasks to process');
      return;
    }
    
    console.log(`Processing ${stats.pending} pending cleanup tasks`);
    const result = await cleanupService.processPendingTasks(20); // Process up to 20 tasks at once
    
    console.log(`Cleanup processing complete:
      - Processed: ${result.processed}
      - Succeeded: ${result.succeeded}
      - Failed: ${result.failed}`);
  } catch (error) {
    console.error('Error in scheduled cleanup task processing:', error);
  }
} 