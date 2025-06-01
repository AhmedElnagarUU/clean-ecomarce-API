import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { CustomerUseCase } from '../application/customer.usecase';
import { CustomerMongoRepository } from './customer.mongo.repo';
// Import validation middleware and schemas if you create them
// import { validateResource } from '../../../middleware/validateResource';
// import { createCustomerSchema, updateCustomerSchema } from './customer.schema'; // If you create these

const router = Router();

// Instantiate repository, use case, and controller
const customerRepository = new CustomerMongoRepository();
const customerUseCase = new CustomerUseCase(customerRepository);
const customerController = new CustomerController(customerUseCase);

// Define routes
// Add validateResource middleware if schemas are created
router.post('/', /* validateResource(createCustomerSchema), */ customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', /* validateResource(updateCustomerSchema), */ customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;