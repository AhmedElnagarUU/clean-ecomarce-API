import { ICleanupRepository } from '../domain/cleanup.repository.interface';
import { Cleanup, CleanupStatus, CleanupType } from '../domain/entities/cleanup.entity';
import { CreateCleanupDto } from './DTO/create-cleanup.dto';
import { UpdateCleanupDto } from './DTO/update-cleanup.dto';

export class CleanupUseCase {     
  constructor(private readonly cleanupRepository: ICleanupRepository) {}

  async createCleanup(dto: CreateCleanupDto): Promise<Cleanup> {
    const cleanup: Partial<Cleanup> = {
      ...dto,
      status: 'pending',
      priority: dto.priority || 'normal',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.cleanupRepository.create(cleanup as Cleanup);
  }

  async getCleanupById(id: string): Promise<Cleanup | null> {
    return this.cleanupRepository.findById(id);
  }

  async getCleanupsByType(type: CleanupType): Promise<Cleanup[]> {
    return this.cleanupRepository.findByType(type);
  }

  async getCleanupsByStatus(status: CleanupStatus): Promise<Cleanup[]> {
    return this.cleanupRepository.findByStatus(status);
  }

  async updateCleanup(id: string, dto: UpdateCleanupDto): Promise<Cleanup | null> {
    const existingCleanup = await this.cleanupRepository.findById(id);
    if (!existingCleanup) {
      return null;
    }

    const updateData: Partial<Cleanup> = {
      ...dto,
      updatedAt: new Date(),
    };

    if (dto.status === 'in_progress') {
      updateData.startedAt = new Date();
    } else if (dto.status === 'completed' || dto.status === 'failed') {
      updateData.completedAt = new Date();
    }

    return this.cleanupRepository.update(id, updateData);
  }

  async updateCleanupStatus(id: string, status: CleanupStatus, errorMessage?: string): Promise<Cleanup | null> {
    return this.cleanupRepository.updateStatus(id, status, errorMessage);
  }

  async deleteCleanup(id: string): Promise<boolean> {
    return this.cleanupRepository.delete(id);
  }

  async deleteCleanupsByStatus(status: CleanupStatus): Promise<boolean> {
    return this.cleanupRepository.deleteByStatus(status);
  }

  async getPendingCleanups(): Promise<Cleanup[]> {
    return this.cleanupRepository.findPendingCleanups();
  }

  async getOverdueCleanups(): Promise<Cleanup[]> {
    return this.cleanupRepository.findOverdueCleanups();
  }

  async scheduleExpiredSessionsCleanup(scheduledFor: Date): Promise<Cleanup> {
    const dto: CreateCleanupDto = {
      type: 'expired_sessions',
      priority: 'normal',
      scheduledFor,
    };

    return this.createCleanup(dto);
  }

  async scheduleOldNotificationsCleanup(scheduledFor: Date): Promise<Cleanup> {
    const dto: CreateCleanupDto = {
      type: 'old_notifications',
      priority: 'low',
      scheduledFor,
    };

    return this.createCleanup(dto);
  }

  async scheduleTemporaryFilesCleanup(scheduledFor: Date): Promise<Cleanup> {
    const dto: CreateCleanupDto = {
      type: 'temporary_files',
      priority: 'low',
      scheduledFor,
    };

    return this.createCleanup(dto);
  }

  async scheduleFailedPaymentsCleanup(scheduledFor: Date): Promise<Cleanup> {
    const dto: CreateCleanupDto = {
      type: 'failed_payments',
      priority: 'high',
      scheduledFor,
    };

    return this.createCleanup(dto);
  }

  async scheduleAbandonedCartsCleanup(scheduledFor: Date): Promise<Cleanup> {
    const dto: CreateCleanupDto = {
      type: 'abandoned_carts',
      priority: 'normal',
      scheduledFor,
    };

    return this.createCleanup(dto);
  }
} 