import { Request, Response } from 'express';
import { CleanupUseCase } from '../application/cleanup.usecase';
import { CreateCleanupDto } from '../application/DTO/create-cleanup.dto';
import { UpdateCleanupDto } from '../application/DTO/update-cleanup.dto';
import { CleanupRepository } from './cleanup.repository';
import { CleanupType } from '../domain/entities/cleanup.entity';

export class CleanupController {
  private cleanupUseCase: CleanupUseCase;

  constructor() {
    const cleanupRepository = new CleanupRepository();
    this.cleanupUseCase = new CleanupUseCase(cleanupRepository);
  }    

  async createCleanup(req: Request, res: Response): Promise<void> {
    try {
      const createCleanupDto: CreateCleanupDto = req.body;
      const cleanup = await this.cleanupUseCase.createCleanup(createCleanupDto);
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error creating cleanup task', error });
    }
  }

  async getCleanupById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cleanup = await this.cleanupUseCase.getCleanupById(id);
      if (!cleanup) {
        res.status(404).json({ message: 'Cleanup task not found' });
        return;
      }
      res.json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving cleanup task', error });
    }
  }

  async getCleanupsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const validTypes: CleanupType[] = ['expired_sessions', 'old_notifications', 'temporary_files', 'failed_payments', 'abandoned_carts'];
      if (!validTypes.includes(type as CleanupType)) {
        res.status(400).json({ message: 'Invalid cleanup type' });
        return;
      }
      const cleanups = await this.cleanupUseCase.getCleanupsByType(type as CleanupType);
      res.json(cleanups);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving cleanup tasks', error });
    }
  }

  async updateCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateCleanupDto: UpdateCleanupDto = req.body;
      const cleanup = await this.cleanupUseCase.updateCleanup(id, updateCleanupDto);
      if (!cleanup) {
        res.status(404).json({ message: 'Cleanup task not found' });
        return;
      }
      res.json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error updating cleanup task', error });
    }
  }

  async scheduleExpiredSessionsCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupUseCase.scheduleExpiredSessionsCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling expired sessions cleanup', error });
    }
  }

  async scheduleOldNotificationsCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupUseCase.scheduleOldNotificationsCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling old notifications cleanup', error });
    }
  }

  async scheduleTemporaryFilesCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupUseCase.scheduleTemporaryFilesCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling temporary files cleanup', error });
    }
  }

  async scheduleFailedPaymentsCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupUseCase.scheduleFailedPaymentsCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling failed payments cleanup', error });
    }
  }

  async scheduleAbandonedCartsCleanup(req: Request, res: Response): Promise<void> {
    try {
      const { scheduledFor } = req.body;
      const cleanup = await this.cleanupUseCase.scheduleAbandonedCartsCleanup(new Date(scheduledFor));
      res.status(201).json(cleanup);
    } catch (error) {
      res.status(500).json({ message: 'Error scheduling abandoned carts cleanup', error });
    }
  }
} 