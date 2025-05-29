import { Router } from 'express';
import { ProductController } from './product.controller';
import { validateResource } from '../../../middleware/validateResource';
import { isAuthenticated } from '../../../middleware/auth.middleware';
import { isAdmin } from '../../../middleware/auth.middleware';
import { upload, handleProductImageUpload } from '../../../middleware/upload.middleware';
import { ProductUseCase } from '../application/product.usecase';
import { ProductMongoRepository } from './product.mongo.repo';
const router = Router();

const repository = new ProductMongoRepository();
const productUseCase = new ProductUseCase(repository);
const productController = new ProductController(productUseCase);


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
       
// router.route('/:id')
//   .get(productController.getProductById)
//   .put(
//     upload.array('images', 5), // Allow up to 5 images
//     handleProductImageUpload,
//     validateResource(updateProductSchema),
//     productController.updateProduct
//   )
//   .delete(productController.deleteProduct);

// router.patch('/:id/status', 
//   validateResource(updateProductStatusSchema),
//   productController.updateProductStatus
// );

export default router; 