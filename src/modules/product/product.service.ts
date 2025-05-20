import { Product } from './entities/product.entity';
import { Product as ProductModel, IProduct } from './infra/product.model';
import { ApiError } from '../../utils/ApiError';
import { getSignedFileUrl, deleteMultipleFromS3 } from '../../middleware/upload.middleware';
import { CleanupService } from '../cleanup/cleanup.service';
import { ProductMapper } from './mappers/product.mapper';

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

  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await ProductModel.find();
      return ProductMapper.toEntities(products);
    } catch (error) {
      throw new ApiError(500, 'Error fetching products');
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const productModel = await ProductModel.findById(id);
      if (!productModel) {
        throw new ApiError(404, 'Product not found');
      }
      return ProductMapper.toEntity(productModel);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching product');
    }
  }

  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
  }): Promise<Product> {
    // 1. Create entity with business logic
    const product = Product.create(
      productData.name,
      productData.description,
      productData.price,
      productData.stock,
      productData.category,
      productData.images
    );

    // 2. Convert entity to model for database
    const productModel = new ProductModel(ProductMapper.toModel(product));

    // 3. Save to database
    const savedModel = await productModel.save();

    // 4. Convert back to entity and return
    return ProductMapper.toEntity(savedModel);
  }

  async updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null> {
    try {
      // 1. Get existing product
      const existingModel = await ProductModel.findById(id);
      if (!existingModel) return null;

      // 2. Convert to entity
      const product = ProductMapper.toEntity(existingModel);

      // 3. Update entity with business logic
      if (updateData.name) product.name = updateData.name;
      if (updateData.description) product.description = updateData.description;
      if (updateData.price) product.price = updateData.price;
      if (updateData.stock) product.stock = updateData.stock;
      if (updateData.category) product.category = updateData.category;
      if (updateData.images) product.images = updateData.images;
      if (updateData.status) product.status = updateData.status;

      // 4. Convert back to model and save
      const updatedModel = await ProductModel.findByIdAndUpdate(
        id,
        ProductMapper.toModel(product),
        { new: true }
      );

      // 5. Return updated entity
      return updatedModel ? ProductMapper.toEntity(updatedModel) : null;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating product');
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await ProductModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Error in deleteProduct:', error);
      throw new ApiError(500, 'Error deleting product');
    }
  }

  async updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<ProductWithUrls> {
    try {
      const product = await ProductModel.findByIdAndUpdate(
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

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    // 1. Get product
    const product = await this.getProductById(id);
    if (!product) return null;

    // 2. Update stock using entity business logic
    product.updateStock(quantity);

    // 3. Save changes
    const updatedModel = await ProductModel.findByIdAndUpdate(
      id,
      ProductMapper.toModel(product),
      { new: true }
    );

    return updatedModel ? ProductMapper.toEntity(updatedModel) : null;
  }
} 