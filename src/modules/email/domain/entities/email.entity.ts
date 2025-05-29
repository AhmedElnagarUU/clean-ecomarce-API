export type EmailType = 'order_confirmation' | 'shipping_update' | 'payment_confirmation' | 'password_reset' | 'welcome' | 'promotion';
export type EmailStatus = 'pending' | 'sent' | 'failed';
export type EmailPriority = 'low' | 'normal' | 'high';

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface Email {
  id: string;
  type: EmailType;
  from: EmailRecipient;
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  priority: EmailPriority;
  status: EmailStatus;
  errorMessage?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 