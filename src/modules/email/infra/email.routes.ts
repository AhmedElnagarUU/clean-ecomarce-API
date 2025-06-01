import { Router } from 'express';
import { EmailController } from '../email.controller';

const router = Router();
const emailController = new EmailController();

// Basic email operations
router.post('/', (req, res) => emailController.createEmail(req, res));
router.get('/:id', (req, res) => emailController.getEmailById(req, res));
router.get('/type/:type', (req, res) => emailController.getEmailsByType(req, res));
router.patch('/:id', (req, res) => emailController.updateEmail(req, res));

// Specialized email endpoints
router.post('/order-confirmation', (req, res) => emailController.createOrderConfirmationEmail(req, res));
router.post('/shipping-update', (req, res) => emailController.createShippingUpdateEmail(req, res));
router.post('/password-reset', (req, res) => emailController.createPasswordResetEmail(req, res));

export default router; 