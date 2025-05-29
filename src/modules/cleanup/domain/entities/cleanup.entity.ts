export type CleanupType = 'expired_sessions' | 'old_notifications' | 'temporary_files' | 'failed_payments' | 'abandoned_carts';
export type CleanupStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type CleanupPriority = 'low' | 'normal' | 'high';

export interface CleanupResult {
  itemsProcessed: number;
  itemsDeleted: number;
  errors: string[];
  startTime: Date;
  endTime: Date;
}

export interface Cleanup {
  id: string;
  type: CleanupType;
  status: CleanupStatus;
  priority: CleanupPriority;
  result?: CleanupResult;
  errorMessage?: string;
  scheduledFor: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 