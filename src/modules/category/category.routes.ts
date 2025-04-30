import { Router } from 'express';
import { categoryController } from './category.controller';
import { validateResource } from '../../middleware/validateResource';
import { isAuthenticated } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/auth.middleware';
import { createCategorySchema, updateCategorySchema, updateCategoryStatusSchema } from './category.schema';

const router = Router();

// Public routes
router.get('/names', categoryController.getCategoryNames);

// Protected routes (require authentication)
router.use(isAuthenticated);
router.use(isAdmin);

router.route('/')
  .get(categoryController.getAllCategories)
  .post(validateResource(createCategorySchema), categoryController.createCategory);

router.route('/:id')
  .get(categoryController.getCategoryById)
  .put(validateResource(updateCategorySchema), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.patch('/:id/status', 
  validateResource(updateCategoryStatusSchema),
  categoryController.updateCategoryStatus
);

export default router; 