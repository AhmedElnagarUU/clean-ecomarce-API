import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationUseCase } from '../../application/notification.usecase';
import { NotificationRepository } from '../repositories/notification.repository';

const router = Router();
const notificationRepository = new NotificationRepository();
const notificationUseCase = new NotificationUseCase(notificationRepository);
const notificationController = new NotificationController(notificationUseCase);

// Create a new notification
router.post('/', (req, res) => notificationController.createNotification(req, res));

// Get notification by ID
router.get('/:id', (req, res) => notificationController.getNotificationById(req, res));

// Get notifications by user ID
router.get('/user/:userId', (req, res) => notificationController.getNotificationsByUserId(req, res));

// Get notifications by type
router.get('/type/:type', (req, res) => notificationController.getNotificationsByType(req, res));

// Get notifications by status
router.get('/status/:status', (req, res) => notificationController.getNotificationsByStatus(req, res));

// Update notification
router.put('/:id', (req, res) => notificationController.updateNotification(req, res));

// Mark notification as read
router.patch('/:id/read', (req, res) => notificationController.markAsRead(req, res));

// Mark all notifications as read for a user
router.patch('/user/:userId/read-all', (req, res) => notificationController.markAllAsRead(req, res));

// Delete notification
router.delete('/:id', (req, res) => notificationController.deleteNotification(req, res));

// Delete all notifications for a user
router.delete('/user/:userId', (req, res) => notificationController.deleteAllNotificationsByUserId(req, res));

export default router; 