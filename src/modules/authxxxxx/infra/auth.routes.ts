import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthUseCase } from '../application/auth.usecase';
import { AuthMongoRepository } from './auth.mongo.repo';
import { isAuthenticated } from '../../../middleware/auth.middleware';

const router = Router();

const authRepository = new AuthMongoRepository();
const authUseCase = new AuthUseCase(authRepository);
const authController = new AuthController(authUseCase);

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// Protected routes
router.use(isAuthenticated);
router.get('/profile', (req, res) => authController.getProfile(req, res));

export default router;