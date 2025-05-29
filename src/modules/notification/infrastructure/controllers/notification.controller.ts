import { Request, Response } from 'express';
import { NotificationUseCase } from '../../application/notification.usecase';
import { CreateNotificationDto } from '../../application/DTO/create-notification.dto';
import { UpdateNotificationDto } from '../../application/DTO/update-notification.dto';

export class NotificationController {
  constructor(private readonly notificationUseCase: NotificationUseCase) {}

  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const createNotificationDto: CreateNotificationDto = req.body;
      const notification = await this.notificationUseCase.createNotification(createNotificationDto);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await this.notificationUseCase.getNotificationById(id);
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNotificationsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const notifications = await this.notificationUseCase.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNotificationsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const notifications = await this.notificationUseCase.getNotificationsByType(type as any);
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNotificationsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const notifications = await this.notificationUseCase.getNotificationsByStatus(status as any);
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateNotificationDto: UpdateNotificationDto = req.body;
      const notification = await this.notificationUseCase.updateNotification(id, updateNotificationDto);
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await this.notificationUseCase.markAsRead(id);
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const success = await this.notificationUseCase.markAllAsRead(userId);
      if (!success) {
        res.status(400).json({ message: 'Failed to mark notifications as read' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.notificationUseCase.deleteNotification(id);
      if (!success) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteAllNotificationsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const success = await this.notificationUseCase.deleteAllNotificationsByUserId(userId);
      if (!success) {
        res.status(400).json({ message: 'Failed to delete notifications' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
} 