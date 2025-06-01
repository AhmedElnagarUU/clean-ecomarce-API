import { Router } from 'express';
import { CleanupController } from './cleanup.controller';

const router = Router();
const cleanupController = new CleanupController();

// Basic cleanup operations
router.post('/', (req, res) => cleanupController.createCleanup(req, res));
router.get('/:id', (req, res) => cleanupController.getCleanupById(req, res));
router.get('/type/:type', (req, res) => cleanupController.getCleanupsByType(req, res));
router.patch('/:id', (req, res) => cleanupController.updateCleanup(req, res));

// Specialized cleanup scheduling endpoints
router.post('/schedule/expired-sessions', (req, res) => cleanupController.scheduleExpiredSessionsCleanup(req, res));
router.post('/schedule/old-notifications', (req, res) => cleanupController.scheduleOldNotificationsCleanup(req, res));
router.post('/schedule/temporary-files', (req, res) => cleanupController.scheduleTemporaryFilesCleanup(req, res));
router.post('/schedule/failed-payments', (req, res) => cleanupController.scheduleFailedPaymentsCleanup(req, res));
router.post('/schedule/abandoned-carts', (req, res) => cleanupController.scheduleAbandonedCartsCleanup(req, res));

export default router; 