import { EmailStatus } from '../../domain/entities/email.entity';

export interface UpdateEmailDto {
  status?: EmailStatus;
  errorMessage?: string;
  sentAt?: Date;
} 