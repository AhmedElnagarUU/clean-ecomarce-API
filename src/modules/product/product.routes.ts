import { Router } from 'express';
import { ProductController } from './product.controller';
import { validateResource } from '../../middleware/validateResource';
import { isAuthenticated } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/auth.middleware';
import { createProductSchema, updateProductSchema, updateProductStatusSchema } from './product.schema';
import { upload, handleProductImageUpload } from '../../middleware/upload.middleware';
import { ProductService } from './product.service';
const router = Router();

const productService = new ProductService();
const productController = new ProductController(productService);

// Protected routes (require authentication)
router.use(isAuthenticated);
router.use(isAdmin);

router.route('/')
  .get(productController.getAllProducts)
  .post(
    upload.array('images', 5), // Allow up to 5 images
    handleProductImageUpload,
    // validateResource(createProductSchema),
    productController.createProduct
  );

router.route('/:id')
  .get(productController.getProductById)
  .put(
    upload.array('images', 5), // Allow up to 5 images
    handleProductImageUpload,
    validateResource(updateProductSchema),
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

router.patch('/:id/status', 
  validateResource(updateProductStatusSchema),
  productController.updateProductStatus
);

export default router; 