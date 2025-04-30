import { CleanupTask, ICleanupTask } from './cleanup.model';
import { deleteFromS3 } from '../../middleware/upload.middleware';
import { ApiError } from '../../utils/ApiError';

export class CleanupService {
  /**
   * Create a new cleanup task for failed S3 deletions
   */
  async createCleanupTask(
    resourceType: string,
    resourceId: string,
    fileKeys: string[]
  ): Promise<ICleanupTask> {
    try {
      if (!fileKeys || fileKeys.length === 0) {
        throw new ApiError(400, 'No file keys provided for cleanup');
      }

      const cleanupTask = new CleanupTask({
        resourceType,
        resourceId,
        fileKeys,
        status: 'pending'
      });

      await cleanupTask.save();
      console.log(`Created cleanup task for ${resourceType} ${resourceId} with ${fileKeys.length} files`);
      return cleanupTask;
    } catch (error) {
      console.error('Error creating cleanup task:', error);
      throw new ApiError(500, 'Failed to create cleanup task');
    }
  }

  /**
   * Process pending cleanup tasks
   */
  async processPendingTasks(limit: number = 10): Promise<{
    processed: number,
    succeeded: number,
    failed: number
  }> {
    try {
      // Find pending tasks, prioritize older tasks and those with fewer attempts
      const pendingTasks = await CleanupTask.find({ status: 'pending' })
        .sort({ attempts: 1, createdAt: 1 })
        .limit(limit);

      if (pendingTasks.length === 0) {
        return { processed: 0, succeeded: 0, failed: 0 };
      }

      console.log(`Processing ${pendingTasks.length} pending cleanup tasks`);
      
      let succeeded = 0;
      let failed = 0;

      for (const task of pendingTasks) {
        // Mark as in progress
        task.status = 'in_progress';
        task.attempts += 1;
        task.lastAttempt = new Date();
        await task.save();

        try {
          // Process each file key
          const remainingKeys: string[] = [];
          
          for (const fileKey of task.fileKeys) {
            const deleted = await deleteFromS3(fileKey);
            if (!deleted) {
              remainingKeys.push(fileKey);
            }
          }

          // Update task status based on results
          if (remainingKeys.length === 0) {
            // All files were deleted successfully
            task.status = 'completed';
            succeeded++;
            console.log(`Cleanup task ${task._id} completed successfully`);
          } else {
            // Some files still need deletion
            task.fileKeys = remainingKeys;
            task.status = 'pending';
            
            // If we've tried too many times, mark as failed
            if (task.attempts >= 5) {
              task.status = 'failed';
              failed++;
              console.error(`Cleanup task ${task._id} failed after ${task.attempts} attempts. ${remainingKeys.length} files could not be deleted.`);
            }
          }
        } catch (error) {
          // Error processing this task
          console.error(`Error processing cleanup task ${task._id}:`, error);
          task.status = task.attempts >= 5 ? 'failed' : 'pending';
          failed++;
        }

        // Save the updated task
        await task.save();
      }

      return {
        processed: pendingTasks.length,
        succeeded,
        failed
      };
    } catch (error) {
      console.error('Error processing cleanup tasks:', error);
      throw new ApiError(500, 'Failed to process cleanup tasks');
    }
  }

  /**
   * Get stats about cleanup tasks
   */
  async getCleanupStats(): Promise<{
    pending: number,
    inProgress: number,
    completed: number,
    failed: number,
    total: number
  }> {
    const [pending, inProgress, completed, failed, total] = await Promise.all([
      CleanupTask.countDocuments({ status: 'pending' }),
      CleanupTask.countDocuments({ status: 'in_progress' }),
      CleanupTask.countDocuments({ status: 'completed' }),
      CleanupTask.countDocuments({ status: 'failed' }),
      CleanupTask.countDocuments()
    ]);

    return {
      pending,
      inProgress,
      completed,
      failed,
      total
    };
  }
} 