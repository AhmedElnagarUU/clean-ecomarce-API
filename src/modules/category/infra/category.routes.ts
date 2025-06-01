import { Router } from 'express';
import { CategoryController } from './category.controller';
import { CategoryUseCase } from '../application/category.usecase';
import { CategoryMongoRepository } from './category.mongo.repo';
import { validateResource } from '../../../middleware/validateResource';
import { isAuthenticated } from '../../../middleware/auth.middleware';
import { isAdmin } from '../../../middleware/auth.middleware';
import { createCategorySchema, updateCategorySchema, updateCategoryStatusSchema } from './category.schema';

const router = Router();

const categoryRepository = new CategoryMongoRepository();
const categoryUseCase = new CategoryUseCase(categoryRepository);
const categoryController = new CategoryController(categoryUseCase);

// Public routes (example, adjust as needed)
// router.get('/names', categoryController.getCategoryNames); // Assuming getCategoryNames is still relevant

// Protected routes
router.use(isAuthenticated);
router.use(isAdmin);

router.post('/', validateResource(createCategorySchema), (req, res) => categoryController.createCategory(req, res));
router.get('/', (req, res) => categoryController.getAllCategories(req, res));
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));
router.put('/:id', validateResource(updateCategorySchema), (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));
// Example for status update, if still needed:
// router.patch('/:id/status', validateResource(updateCategoryStatusSchema), categoryController.updateCategoryStatus);

export default router;