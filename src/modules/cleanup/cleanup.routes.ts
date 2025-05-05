import { Router } from 'express';
import { CleanupController } from './cleanup.controller';
import { CleanupService } from './cleanup.service';
// import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

const cleanupService = new CleanupService();
const cleanupController = new CleanupController(cleanupService);

// Protect all cleanup routes with authentication - only admins should access
// router.use(authMiddleware);

// GET /api/v1/cleanup/stats - Get cleanup task statistics
router.get('/stats', cleanupController.getStats);

// POST /api/v1/cleanup/process - Process pending cleanup tasks
router.post('/process', cleanupController.processTasks);

export default router; 