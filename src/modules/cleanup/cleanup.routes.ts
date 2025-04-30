import { Router } from 'express';
import { cleanupController } from './cleanup.controller';
// import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Protect all cleanup routes with authentication - only admins should access
// router.use(authMiddleware);

// GET /api/v1/cleanup/stats - Get cleanup task statistics
router.get('/stats', cleanupController.getStats);

// POST /api/v1/cleanup/process - Process pending cleanup tasks
router.post('/process', cleanupController.processTasks);

export default router; 