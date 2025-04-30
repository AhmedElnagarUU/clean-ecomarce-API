import mongoose, { Document, Schema } from 'mongoose';

export interface ICleanupTask extends Document {
  resourceType: string;  // e.g., 'product'
  resourceId: string;    // e.g., product ID
  fileKeys: string[];    // S3 file keys to delete
  attempts: number;      // Number of cleanup attempts
  lastAttempt: Date;     // Last attempt timestamp
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const cleanupTaskSchema = new Schema({
  resourceType: {
    type: String,
    required: true,
    index: true
  },
  resourceId: {
    type: String,
    required: true,
    index: true
  },
  fileKeys: {
    type: [String],
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttempt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
cleanupTaskSchema.index({ resourceType: 1, resourceId: 1 });
cleanupTaskSchema.index({ status: 1, lastAttempt: 1 });

export const CleanupTask = mongoose.model<ICleanupTask>('CleanupTask', cleanupTaskSchema); 