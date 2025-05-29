import { EmailAttachment, EmailPriority, EmailRecipient, EmailType } from '../../domain/entities/email.entity';

export interface CreateEmailDto {
  type: EmailType;
  from: EmailRecipient;
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  priority?: EmailPriority;
} 