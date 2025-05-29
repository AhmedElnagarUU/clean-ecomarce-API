import { Cleanup, CleanupStatus, CleanupType } from './entities/cleanup.entity';

export interface ICleanupRepository {
  create(cleanup: Cleanup): Promise<Cleanup>;
  findById(id: string): Promise<Cleanup | null>;
  findByType(type: CleanupType): Promise<Cleanup[]>;
  findByStatus(status: CleanupStatus): Promise<Cleanup[]>;
  findPendingCleanups(): Promise<Cleanup[]>;
  update(id: string, data: Partial<Cleanup>): Promise<Cleanup | null>;
  updateStatus(id: string, status: CleanupStatus, errorMessage?: string): Promise<Cleanup | null>;
  delete(id: string): Promise<boolean>;
  deleteByStatus(status: CleanupStatus): Promise<boolean>;
  findOverdueCleanups(): Promise<Cleanup[]>;
} 