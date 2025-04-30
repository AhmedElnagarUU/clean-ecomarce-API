import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

export class NotificationController {
  /**
   * Get all notifications
   */
  static async getNotifications(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const notifications = await NotificationService.getNotifications(limit);
      
      return res.json({
        success: true,
        data: notifications
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(req: Request, res: Response) {
    try {
      const notification = await NotificationService.markAsRead(req.params.id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      return res.json({
        success: true,
        data: notification
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(req: Request, res: Response) {
    try {
      await NotificationService.markAllAsRead();
      
      return res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(req: Request, res: Response) {
    try {
      const count = await NotificationService.getUnreadCount();
      
      return res.json({
        success: true,
        data: { count }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
} 