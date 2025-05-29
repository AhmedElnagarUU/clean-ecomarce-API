import { Router } from 'express';
import { CategoryController } from './category.controller';
import { CategoryUseCase } from '../application/category.usecase';
import { CategoryMongoRepository } from './category.mongo.repo';

const router = Router();

const categoryRepository = new CategoryMongoRepository();
const categoryUseCase = new CategoryUseCase(categoryRepository);
const categoryController = new CategoryController(categoryUseCase);

// Routes
router.post('/', (req, res) => categoryController.createCategory(req, res));
router.get('/', (req, res) => categoryController.getAllCategories(req, res));
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));
router.put('/:id', (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));

export default router;