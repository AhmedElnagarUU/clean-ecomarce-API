import express from 'express';

import { isAuthenticated } from '../../middleware/auth.middleware';
import { AdminController } from '../admin/admin.controller';

const router = express.Router();

// Admin authentication routes

router.post('/admin/login', AdminController.loginAdmin);

router.post('/admin/register', AdminController.registerAdmin);

router.post('/admin/logout', isAuthenticated, AdminController.logoutAdmin)
;
router.get('/admin/check-super-admin', AdminController.checkSuperAdmin);

export default router; 