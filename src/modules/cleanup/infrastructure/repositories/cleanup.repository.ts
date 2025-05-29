import { ICleanupRepository } from '../../domain/cleanup.repository.interface';
import { Cleanup, CleanupStatus, CleanupType } from '../../domain/entities/cleanup.entity';
import { PrismaClient } from '@prisma/client';

export class CleanupRepository implements ICleanupRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(cleanup: Cleanup): Promise<Cleanup> {
    return this.prisma.cleanup.create({
      data: cleanup,
    });
  }

  async findById(id: string): Promise<Cleanup | null> {
    return this.prisma.cleanup.findUnique({
      where: { id },
    });
  }

  async findByType(type: CleanupType): Promise<Cleanup[]> {
    return this.prisma.cleanup.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: CleanupStatus): Promise<Cleanup[]> {
    return this.prisma.cleanup.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPendingCleanups(): Promise<Cleanup[]> {
    return this.prisma.cleanup.findMany({
      where: { status: 'pending' },
      orderBy: [
        { priority: 'desc' },
        { scheduledFor: 'asc' },
      ],
    });
  }

  async update(id: string, data: Partial<Cleanup>): Promise<Cleanup | null> {
    return this.prisma.cleanup.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: CleanupStatus, errorMessage?: string): Promise<Cleanup | null> {
    return this.prisma.cleanup.update({
      where: { id },
      data: {
        status,
        errorMessage,
        startedAt: status === 'in_progress' ? new Date() : undefined,
        completedAt: status === 'completed' || status === 'failed' ? new Date() : undefined,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.cleanup.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByStatus(status: CleanupStatus): Promise<boolean> {
    try {
      await this.prisma.cleanup.deleteMany({
        where: { status },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findOverdueCleanups(): Promise<Cleanup[]> {
    const now = new Date();
    return this.prisma.cleanup.findMany({
      where: {
        status: 'pending',
        scheduledFor: {
          lte: now,
        },
      },
      orderBy: [
        { priority: 'desc' },
        { scheduledFor: 'asc' },
      ],
    });
  }
} 