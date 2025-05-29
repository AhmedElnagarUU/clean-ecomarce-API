import { Router } from 'express';
import { NotificationController } from './notification.controller';
// import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Get all notifications
router.get('/',  NotificationController.getNotifications);

// Mark a notification as read
router.put('/:id/read',  NotificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', NotificationController.markAllAsRead);

// Get unread notifications count
router.get('/unread/count', NotificationController.getUnreadCount);

export default router; 