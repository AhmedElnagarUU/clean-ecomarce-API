import { Request, Response } from 'express';
import { CleanupService } from './cleanup.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';

const cleanupService = new CleanupService();

export const cleanupController = {
  // Process pending cleanup tasks manually
  processTasks: asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await cleanupService.processPendingTasks(limit);
    return res.json(
      new ApiResponse(200, result, `Processed ${result.processed} cleanup tasks`)
    );
  }),

  // Get cleanup task statistics
  getStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await cleanupService.getCleanupStats();
    return res.json(
      new ApiResponse(200, stats, 'Cleanup stats retrieved successfully')
    );
  }),
}; 