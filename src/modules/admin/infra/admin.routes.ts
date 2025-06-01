import express from 'express';
import { AdminController } from './admin.controller';
import { AdminUseCase } from '../application/admin.usecase';
import { AdminRepository } from './admin.repository';
// I WELL NOT NEED THIS FILE BECAUSE I WILL USE THE AUTH ROUTES TO REGISTER AND LOGIN  FOR ALL USERS OF THE SYSTEM

const router = express.Router();

const adminRepository = new AdminRepository();
const adminUseCase = new AdminUseCase(adminRepository);
const adminController = new AdminController(adminUseCase);





// GET Routes
router.get('/', adminController.getAllAdmins);
router.get('/super-admins', adminController.getSuperAdmins);
router.get('/check-super-admin', adminController.checkSuperAdmin);
router.get('/:id', adminController.getAdminById);

// POST Routes
router.post('/', adminController.registerAdmin);

// PUT Routes
router.put('/:id', adminController.updateAdmin);
router.put('/:id/status', adminController.changeAdminStatus);

// DELETE Routes
router.delete('/:id', adminController.deleteAdmin);

export default router;