import { CleanupStatus } from '../../domain/entities/cleanup.entity';

export interface UpdateCleanupDto {
  status?: CleanupStatus;
  errorMessage?: string;
  result?: {
    itemsProcessed: number;
    itemsDeleted: number;
    errors: string[];
    startTime: Date;
    endTime: Date;
  };
} 