import { CleanupPriority, CleanupType } from '../../domain/entities/cleanup.entity';

export interface CreateCleanupDto {
  type: CleanupType;
  priority?: CleanupPriority;
  scheduledFor: Date;
} 