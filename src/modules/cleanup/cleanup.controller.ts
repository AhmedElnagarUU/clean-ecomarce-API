import { Request, Response } from 'express';
import { CleanupService } from './cleanup.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';

// const cleanupService = new CleanupService();

export class CleanupController  {
  constructor(private readonly cleanupService : CleanupService)  {}
  
  // Process pending cleanup tasks manually
  processTasks = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await this.cleanupService.processPendingTasks(limit);
    return res.json(
      new ApiResponse(200, result, `Processed ${result.processed} cleanup tasks`)
    );
  })

  // Get cleanup task statistics
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.cleanupService.getCleanupStats();
    return res.json(
      new ApiResponse(200, stats, 'Cleanup stats retrieved successfully')
    );
  })
}; 