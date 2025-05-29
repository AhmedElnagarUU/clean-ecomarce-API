import { IEmailRepository } from '../domain/email.repository.interface';
import { Email, EmailStatus, EmailType } from '../domain/entities/email.entity';
import { CreateEmailDto } from './DTO/create-email.dto';
import { UpdateEmailDto } from './DTO/update-email.dto';

export class EmailUseCase {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async createEmail(dto: CreateEmailDto): Promise<Email> {
    const email: Partial<Email> = {
      ...dto,
      status: 'pending',
      priority: dto.priority || 'normal',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.emailRepository.create(email as Email);
  }

  async getEmailById(id: string): Promise<Email | null> {
    return this.emailRepository.findById(id);
  }

  async getEmailsByType(type: EmailType): Promise<Email[]> {
    return this.emailRepository.findByType(type);
  }

  async getEmailsByStatus(status: EmailStatus): Promise<Email[]> {
    return this.emailRepository.findByStatus(status);
  }

  async getEmailsByRecipient(email: string): Promise<Email[]> {
    return this.emailRepository.findByRecipient(email);
  }

  async updateEmail(id: string, dto: UpdateEmailDto): Promise<Email | null> {
    const existingEmail = await this.emailRepository.findById(id);
    if (!existingEmail) {
      return null;
    }

    const updateData: Partial<Email> = {
      ...dto,
      updatedAt: new Date(),
    };

    return this.emailRepository.update(id, updateData);
  }

  async updateEmailStatus(id: string, status: EmailStatus, errorMessage?: string): Promise<Email | null> {
    return this.emailRepository.updateStatus(id, status, errorMessage);
  }

  async deleteEmail(id: string): Promise<boolean> {
    return this.emailRepository.delete(id);
  }

  async deleteEmailsByStatus(status: EmailStatus): Promise<boolean> {
    return this.emailRepository.deleteByStatus(status);
  }

  async getPendingEmails(): Promise<Email[]> {
    return this.emailRepository.findPendingEmails();
  }

  async createOrderConfirmationEmail(
    to: Email['to'],
    orderId: string,
    orderDetails: Record<string, any>
  ): Promise<Email> {
    const dto: CreateEmailDto = {
      type: 'order_confirmation',
      from: {
        email: 'orders@example.com',
        name: 'Order Confirmation',
      },
      to,
      subject: `Order Confirmation - Order #${orderId}`,
      html: this.generateOrderConfirmationHtml(orderId, orderDetails),
      text: this.generateOrderConfirmationText(orderId, orderDetails),
      priority: 'high',
    };

    return this.createEmail(dto);
  }

  async createShippingUpdateEmail(
    to: Email['to'],
    orderId: string,
    trackingNumber: string
  ): Promise<Email> {
    const dto: CreateEmailDto = {
      type: 'shipping_update',
      from: {
        email: 'shipping@example.com',
        name: 'Shipping Update',
      },
      to,
      subject: `Shipping Update - Order #${orderId}`,
      html: this.generateShippingUpdateHtml(orderId, trackingNumber),
      text: this.generateShippingUpdateText(orderId, trackingNumber),
      priority: 'normal',
    };

    return this.createEmail(dto);
  }

  async createPasswordResetEmail(
    to: Email['to'],
    resetToken: string
  ): Promise<Email> {
    const dto: CreateEmailDto = {
      type: 'password_reset',
      from: {
        email: 'security@example.com',
        name: 'Password Reset',
      },
      to,
      subject: 'Password Reset Request',
      html: this.generatePasswordResetHtml(resetToken),
      text: this.generatePasswordResetText(resetToken),
      priority: 'high',
    };

    return this.createEmail(dto);
  }

  private generateOrderConfirmationHtml(orderId: string, orderDetails: Record<string, any>): string {
    // TODO: Implement HTML template for order confirmation
    return `<h1>Order Confirmation</h1><p>Order #${orderId}</p>`;
  }

  private generateOrderConfirmationText(orderId: string, orderDetails: Record<string, any>): string {
    // TODO: Implement text template for order confirmation
    return `Order Confirmation\nOrder #${orderId}`;
  }

  private generateShippingUpdateHtml(orderId: string, trackingNumber: string): string {
    // TODO: Implement HTML template for shipping update
    return `<h1>Shipping Update</h1><p>Order #${orderId}</p><p>Tracking: ${trackingNumber}</p>`;
  }

  private generateShippingUpdateText(orderId: string, trackingNumber: string): string {
    // TODO: Implement text template for shipping update
    return `Shipping Update\nOrder #${orderId}\nTracking: ${trackingNumber}`;
  }

  private generatePasswordResetHtml(resetToken: string): string {
    // TODO: Implement HTML template for password reset
    return `<h1>Password Reset</h1><p>Reset token: ${resetToken}</p>`;
  }

  private generatePasswordResetText(resetToken: string): string {
    // TODO: Implement text template for password reset
    return `Password Reset\nReset token: ${resetToken}`;
  }
} 