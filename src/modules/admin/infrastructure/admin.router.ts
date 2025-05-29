import { Router } from 'express';
import { AdminContainer } from './admin.container';
import { isAuthenticated } from '../../../middleware/auth.middleware';
import { isSuperAdmin } from '../../../middleware/superAdmin.middleware';

const router = Router();
const adminController = AdminContainer.getInstance().getAdminController();

// Public routes
router.post('/register', adminController.registerAdmin.bind(adminController));
router.post('/login', adminController.loginAdmin.bind(adminController));
router.get('/check-super-admin', adminController.checkSuperAdmin.bind(adminController));

// Protected routes
router.use(isAuthenticated);
router.post('/logout', adminController.logoutAdmin.bind(adminController));
router.get('/', adminController.getAllAdmins.bind(adminController));
router.get('/:id', adminController.getAdminById.bind(adminController));
router.put('/:id', adminController.updateAdmin.bind(adminController));
router.delete('/:id', adminController.deleteAdmin.bind(adminController));
router.get('/super-admins', adminController.getSuperAdmins.bind(adminController));
router.patch('/:id/status', adminController.changeAdminStatus.bind(adminController));

export default router; 