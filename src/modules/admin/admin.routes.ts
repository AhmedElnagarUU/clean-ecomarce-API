import express from 'express';
import { AdminController } from './admin.controller';

// I WELL NOT NEED THIS FILE BECAUSE I WILL USE THE AUTH ROUTES TO REGISTER AND LOGIN  FOR ALL USERS OF THE SYSTEM

const router = express.Router();

// GET Routes
router.get('/', AdminController.getAllAdmins);
router.get('/super-admins', AdminController.getSuperAdmins);
router.get('/check-super-admin', AdminController.checkSuperAdmin);
router.get('/:id', AdminController.getAdminById);

// POST Routes
router.post('/', AdminController.registerAdmin);

// PUT Routes
router.put('/:id', AdminController.updateAdmin);
router.put('/:id/status', AdminController.changeAdminStatus);

// DELETE Routes
router.delete('/:id', AdminController.deleteAdmin);

export default router; 