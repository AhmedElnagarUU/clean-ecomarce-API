import { IEmailRepository } from '../domain/email.repository.interface';
import { Email, EmailStatus, EmailType } from '../domain/entities/email.entity';
import { PrismaClient } from '@prisma/client';

export class EmailRepository implements IEmailRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(email: Email): Promise<Email> {
    return this.prisma.email.create({
      data: email,
    });
  }

  async findById(id: string): Promise<Email | null> {
    return this.prisma.email.findUnique({
      where: { id },
    });
  }

  async findByType(type: EmailType): Promise<Email[]> {
    return this.prisma.email.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: EmailStatus): Promise<Email[]> {
    return this.prisma.email.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRecipient(email: string): Promise<Email[]> {
    return this.prisma.email.findMany({
      where: {
        OR: [
          { to: { some: { email } } },
          { cc: { some: { email } } },
          { bcc: { some: { email } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Partial<Email>): Promise<Email | null> {
    return this.prisma.email.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: EmailStatus, errorMessage?: string): Promise<Email | null> {
    return this.prisma.email.update({
      where: { id },
      data: {
        status,
        errorMessage,
        sentAt: status === 'sent' ? new Date() : undefined,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.email.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByStatus(status: EmailStatus): Promise<boolean> {
    try {
      await this.prisma.email.deleteMany({
        where: { status },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findPendingEmails(): Promise<Email[]> {
    return this.prisma.email.findMany({
      where: { status: 'pending' },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }
} 