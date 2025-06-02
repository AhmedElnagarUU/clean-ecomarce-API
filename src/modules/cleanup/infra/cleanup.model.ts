import mongoose, { Document } from 'mongoose';
import { CleanupStatus, CleanupType, CleanupPriority } from '../domain/entities/cleanup.entity';

export interface CleanupDocument extends Document {
  type: CleanupType;
  status: CleanupStatus;
  priority: CleanupPriority;
  scheduledFor: Date;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cleanupSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['temp_files', 'old_logs', 'expired_sessions', 'unused_uploads']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  startedAt: Date,
  completedAt: Date,
  errorMessage: String
}, {
  timestamps: true
});

export const CleanupModel = mongoose.model<CleanupDocument>('Cleanup', cleanupSchema); 