import { Email, EmailStatus, EmailType } from './entities/email.entity';

export interface IEmailRepository {
  create(email: Email): Promise<Email>;
  findById(id: string): Promise<Email | null>;
  findByType(type: EmailType): Promise<Email[]>;
  findByStatus(status: EmailStatus): Promise<Email[]>;
  findByRecipient(email: string): Promise<Email[]>;
  update(id: string, email: Partial<Email>): Promise<Email | null>;
  updateStatus(id: string, status: EmailStatus, errorMessage?: string): Promise<Email | null>;
  delete(id: string): Promise<boolean>;
  deleteByStatus(status: EmailStatus): Promise<boolean>;
  findPendingEmails(): Promise<Email[]>;
} 