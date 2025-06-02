import { ICleanupRepository } from '../domain/cleanup.repository.interface';
import { Cleanup, CleanupStatus, CleanupType, CleanupPriority } from '../domain/entities/cleanup.entity';
import { CleanupModel, CleanupDocument } from './cleanup.model';
import mongoose from 'mongoose';

export class CleanupRepository implements ICleanupRepository {
  private mapToDomain(cleanupDoc: CleanupDocument): Cleanup {
    return {
      id: (cleanupDoc._id as mongoose.Types.ObjectId).toString(),
      type: cleanupDoc.type,
      status: cleanupDoc.status,
      priority: cleanupDoc.priority as CleanupPriority,
      scheduledFor: cleanupDoc.scheduledFor,
      startedAt: cleanupDoc.startedAt,
      completedAt: cleanupDoc.completedAt,
      errorMessage: cleanupDoc.errorMessage,
      createdAt: cleanupDoc.createdAt,
      updatedAt: cleanupDoc.updatedAt
    };
  }

  async create(cleanup: Cleanup): Promise<Cleanup> {
    const newCleanup = await CleanupModel.create(cleanup);
    return this.mapToDomain(newCleanup);
  }

  async findById(id: string): Promise<Cleanup | null> {
    const cleanup = await CleanupModel.findById(id);
    return cleanup ? this.mapToDomain(cleanup) : null;
  }

  async findByType(type: CleanupType): Promise<Cleanup[]> {
    const cleanups = await CleanupModel.find({ type })
      .sort({ createdAt: -1 });
    return cleanups.map(this.mapToDomain);
  }

  async findByStatus(status: CleanupStatus): Promise<Cleanup[]> {
    const cleanups = await CleanupModel.find({ status })
      .sort({ createdAt: -1 });
    return cleanups.map(this.mapToDomain);
  }

  async findPendingCleanups(): Promise<Cleanup[]> {
    const cleanups = await CleanupModel.find({ status: 'pending' })
      .sort({ priority: -1, scheduledFor: 1 });
    return cleanups.map(this.mapToDomain);
  }

  async update(id: string, data: Partial<Cleanup>): Promise<Cleanup | null> {
    const updatedCleanup = await CleanupModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    return updatedCleanup ? this.mapToDomain(updatedCleanup) : null;
  }

  async updateStatus(id: string, status: CleanupStatus, errorMessage?: string): Promise<Cleanup | null> {
    const updateData: any = {
      status,
      errorMessage,
      updatedAt: new Date()
    };

    if (status === 'in_progress') {
      updateData.startedAt = new Date();
    } else if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date();
    }

    const updatedCleanup = await CleanupModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    return updatedCleanup ? this.mapToDomain(updatedCleanup) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await CleanupModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByStatus(status: CleanupStatus): Promise<boolean> {
    try {
      await CleanupModel.deleteMany({ status });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findOverdueCleanups(): Promise<Cleanup[]> {
    const now = new Date();
    const cleanups = await CleanupModel.find({
      status: 'pending',
      scheduledFor: { $lte: now }
    }).sort({ priority: -1, scheduledFor: 1 });
    return cleanups.map(this.mapToDomain);
  }
} 