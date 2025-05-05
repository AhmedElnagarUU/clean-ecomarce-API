import { Router } from 'express';
import { CategoryController } from './category.controller';
import { validateResource } from '../../middleware/validateResource';
import { isAuthenticated } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/auth.middleware';
import { createCategorySchema, updateCategorySchema, updateCategoryStatusSchema } from './category.schema';
import { CategoryService } from './category.service';

const router = Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

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