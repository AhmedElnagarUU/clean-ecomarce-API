import { Product, IProduct } from './product.model';
import { ApiError } from '../../utils/ApiError';
import { getSignedFileUrl, deleteMultipleFromS3 } from '../../middleware/upload.middleware';
import { CleanupService } from '../cleanup/cleanup.service';

const cleanupService = new CleanupService();

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  status?: 'active' | 'inactive';
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface ProductWithUrls extends Omit<IProduct, 'images'> {
  images: string[];
  imageUrls: string[];
}

export class ProductService {
  private async addImageUrlsToProduct(product: IProduct): Promise<ProductWithUrls> {
    try {
      const imageUrls = await Promise.all(
        product.images.map(imageKey => getSignedFileUrl(imageKey))
      );
      
      const productObject = product.toObject();
      return {
        ...productObject,
        imageUrls
      };
    } catch (error) {
      console.error('Error generating image URLs:', error);
      // Return product without URLs in case of error
      return {
        ...product.toObject(),
        imageUrls: []
      };
    }
  }

  private async addImageUrlsToProducts(products: IProduct[]): Promise<ProductWithUrls[]> {
    return Promise.all(products.map(product => this.addImageUrlsToProduct(product)));
  }

  async getAllProducts(): Promise<ProductWithUrls[]> {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      return this.addImageUrlsToProducts(products);
    } catch (error) {
      throw new ApiError(500, 'Error fetching products');
    }
  }

  async getProductById(id: string): Promise<ProductWithUrls> {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }
      return this.addImageUrlsToProduct(product);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching product');
    }
  }

  async createProduct(data: CreateProductDTO): Promise<ProductWithUrls> {
    try {
      const existingProduct = await Product.findOne({ name: data.name });
      if (existingProduct) {
        throw new ApiError(400, 'Product with this name already exists');
      }

      if (!data.images || data.images.length === 0) {
        throw new ApiError(400, 'At least one product image is required');
      }

      const product = new Product(data);
      await product.save();
      return this.addImageUrlsToProduct(product);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error creating product');
    }
  }

  async updateProduct(id: string, data: UpdateProductDTO): Promise<ProductWithUrls> {
    try {
      if (data.name) {
        const existingProduct = await Product.findOne({ 
          name: data.name,
          _id: { $ne: id }
        });
        if (existingProduct) {
          throw new ApiError(400, 'Product with this name already exists');
        }
      }

      if (data.images && data.images.length === 0) {
        throw new ApiError(400, 'At least one product image is required');
      }

      const product = await Product.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      return this.addImageUrlsToProduct(product);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      // Delete images from S3 before deleting the product
      if (product.images && product.images.length > 0) {
        console.log(`Attempting to delete ${product.images.length} images from S3 for product ${id}`);
        
        // Use the enhanced deleteMultipleFromS3 function that returns status
        const deletionResult = await deleteMultipleFromS3(product.images);
        
        if (deletionResult.success) {
          console.log(`Successfully deleted all images from S3 for product ${id}`);
        } else {
          // Some images failed to delete
          console.warn(`Partial S3 deletion for product ${id}: 
            ${deletionResult.deletedKeys.length} succeeded, 
            ${deletionResult.failedKeys.length} failed`);
          
          if (deletionResult.failedKeys.length > 0) {
            // Create a cleanup task for the failed images
            try {
              await cleanupService.createCleanupTask(
                'product',
                id,
                deletionResult.failedKeys
              );
              console.log(`Created cleanup task for remaining ${deletionResult.failedKeys.length} images`);
            } catch (cleanupError) {
              console.error('Failed to create cleanup task:', cleanupError);
            }
          }
        }
      }

      // Delete the product from database
      await Product.findByIdAndDelete(id);
      
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Error in deleteProduct:', error);
      throw new ApiError(500, 'Error deleting product');
    }
  }

  async updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<ProductWithUrls> {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
      );

      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      return this.addImageUrlsToProduct(product);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating product status');
    }
  }
} 