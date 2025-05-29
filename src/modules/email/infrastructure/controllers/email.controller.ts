import { Request, Response } from 'express';
import { EmailUseCase } from '../../application/email.usecase';
import { CreateEmailDto } from '../../application/DTO/create-email.dto';
import { UpdateEmailDto } from '../../application/DTO/update-email.dto';
import { EmailRepository } from '../repositories/email.repository';

export class EmailController {
  private emailUseCase: EmailUseCase;

  constructor() {
    const emailRepository = new EmailRepository();
    this.emailUseCase = new EmailUseCase(emailRepository);
  }

  async createEmail(req: Request, res: Response): Promise<void> {
    try {
      const createEmailDto: CreateEmailDto = req.body;
      const email = await this.emailUseCase.createEmail(createEmailDto);
      res.status(201).json(email);
    } catch (error) {
      res.status(500).json({ message: 'Error creating email', error });
    }
  }

  async getEmailById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const email = await this.emailUseCase.getEmailById(id);
      if (!email) {
        res.status(404).json({ message: 'Email not found' });
        return;
      }
      res.json(email);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving email', error });
    }
  }

  async getEmailsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const emails = await this.emailUseCase.getEmailsByType(type);
      res.json(emails);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving emails', error });
    }
  }

  async updateEmail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateEmailDto: UpdateEmailDto = req.body;
      const email = await this.emailUseCase.updateEmail(id, updateEmailDto);
      if (!email) {
        res.status(404).json({ message: 'Email not found' });
        return;
      }
      res.json(email);
    } catch (error) {
      res.status(500).json({ message: 'Error updating email', error });
    }
  }

  async createOrderConfirmationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, orderId, orderDetails } = req.body;
      const email = await this.emailUseCase.createOrderConfirmationEmail(to, orderId, orderDetails);
      res.status(201).json(email);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order confirmation email', error });
    }
  }

  async createShippingUpdateEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, orderId, trackingNumber } = req.body;
      const email = await this.emailUseCase.createShippingUpdateEmail(to, orderId, trackingNumber);
      res.status(201).json(email);
    } catch (error) {
      res.status(500).json({ message: 'Error creating shipping update email', error });
    }
  }

  async createPasswordResetEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, resetToken } = req.body;
      const email = await this.emailUseCase.createPasswordResetEmail(to, resetToken);
      res.status(201).json(email);
    } catch (error) {
      res.status(500).json({ message: 'Error creating password reset email', error });
    }
  }
} 