import { IProductInteractor } from '../interfaces/product.interactor.interface';
import { Product } from '../entities/product.entity';
import { Product as ProductModel } from '../product.model';
import { ProductMapper } from '../mappers/product.mapper';
import { ApiError } from '../../../utils/ApiError';

export class ProductInteractor implements IProductInteractor {
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
            if (!productModel) return null;
            return ProductMapper.toEntity(productModel);
        } catch (error) {
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
        try {
            // Validate product data
            await this.validateProductData(productData);
            
            // Check if name is unique
            const isUnique = await this.isProductNameUnique(productData.name);
            if (!isUnique) {
                throw new ApiError(400, 'Product name must be unique');
            }

            // Create entity
            const product = Product.create(
                productData.name,
                productData.description,
                productData.price,
                productData.stock,
                productData.category,
                productData.images
            );

            // Save to database
            const productModel = new ProductModel(ProductMapper.toModel(product));
            const savedModel = await productModel.save();

            return ProductMapper.toEntity(savedModel);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, 'Error creating product');
        }
    }

    async updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null> {
        try {
            const existingModel = await ProductModel.findById(id);
            if (!existingModel) return null;

            const product = ProductMapper.toEntity(existingModel);

            // Validate updates
            await this.validateProductData(updateData);

            // Update entity
            if (updateData.name) {
                const isUnique = await this.isProductNameUnique(updateData.name, id);
                if (!isUnique) {
                    throw new ApiError(400, 'Product name must be unique');
                }
                product.name = updateData.name;
            }
            if (updateData.description) product.description = updateData.description;
            if (updateData.price) product.price = updateData.price;
            if (updateData.stock) product.stock = updateData.stock;
            if (updateData.category) product.category = updateData.category;
            if (updateData.images) product.images = updateData.images;
            if (updateData.status) product.status = updateData.status;

            const updatedModel = await ProductModel.findByIdAndUpdate(
                id,
                ProductMapper.toModel(product),
                { new: true }
            );

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
            throw new ApiError(500, 'Error deleting product');
        }
    }

    async updateStock(id: string, quantity: number): Promise<Product | null> {
        try {
            const product = await this.getProductById(id);
            if (!product) return null;

            product.updateStock(quantity);

            const updatedModel = await ProductModel.findByIdAndUpdate(
                id,
                ProductMapper.toModel(product),
                { new: true }
            );

            return updatedModel ? ProductMapper.toEntity(updatedModel) : null;
        } catch (error) {
            throw new ApiError(500, 'Error updating stock');
        }
    }

    async updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<Product> {
        try {
            const product = await this.getProductById(id);
            if (!product) {
                throw new ApiError(404, 'Product not found');
            }

            product.status = status;

            const updatedModel = await ProductModel.findByIdAndUpdate(
                id,
                ProductMapper.toModel(product),
                { new: true }
            );

            if (!updatedModel) {
                throw new ApiError(404, 'Product not found');
            }

            return ProductMapper.toEntity(updatedModel);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, 'Error updating product status');
        }
    }

    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            const products = await ProductModel.find({ category });
            return ProductMapper.toEntities(products);
        } catch (error) {
            throw new ApiError(500, 'Error fetching products by category');
        }
    }

    async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
        try {
            const products = await ProductModel.find({
                price: { $gte: minPrice, $lte: maxPrice }
            });
            return ProductMapper.toEntities(products);
        } catch (error) {
            throw new ApiError(500, 'Error fetching products by price range');
        }
    }

    async getActiveProducts(): Promise<Product[]> {
        try {
            const products = await ProductModel.find({ status: 'active' });
            return ProductMapper.toEntities(products);
        } catch (error) {
            throw new ApiError(500, 'Error fetching active products');
        }
    }

    async searchProducts(query: string): Promise<Product[]> {
        try {
            const products = await ProductModel.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            });
            return ProductMapper.toEntities(products);
        } catch (error) {
            throw new ApiError(500, 'Error searching products');
        }
    }

    async checkStockAvailability(id: string, quantity: number): Promise<boolean> {
        try {
            const product = await this.getProductById(id);
            if (!product) return false;
            return product.stock >= quantity;
        } catch (error) {
            throw new ApiError(500, 'Error checking stock availability');
        }
    }

    async reserveStock(id: string, quantity: number): Promise<boolean> {
        try {
            const product = await this.getProductById(id);
            if (!product || !this.checkStockAvailability(id, quantity)) {
                return false;
            }

            await this.updateStock(id, -quantity);
            return true;
        } catch (error) {
            throw new ApiError(500, 'Error reserving stock');
        }
    }

    async releaseStock(id: string, quantity: number): Promise<boolean> {
        try {
            await this.updateStock(id, quantity);
            return true;
        } catch (error) {
            throw new ApiError(500, 'Error releasing stock');
        }
    }

    async validateProductData(productData: Partial<Product>): Promise<boolean> {
        try {
            if (productData.name && (!productData.name.trim() || productData.name.length < 3)) {
                throw new ApiError(400, 'Product name must be at least 3 characters long');
            }

            if (productData.price && productData.price < 0) {
                throw new ApiError(400, 'Price cannot be negative');
            }

            if (productData.stock && productData.stock < 0) {
                throw new ApiError(400, 'Stock cannot be negative');
            }

            if (productData.images && (!Array.isArray(productData.images) || productData.images.length === 0)) {
                throw new ApiError(400, 'Product must have at least one image');
            }

            return true;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(400, 'Invalid product data');
        }
    }

    async isProductNameUnique(name: string, excludeId?: string): Promise<boolean> {
        try {
            const query = { name, ...(excludeId && { _id: { $ne: excludeId } }) };
            const existingProduct = await ProductModel.findOne(query);
            return !existingProduct;
        } catch (error) {
            throw new ApiError(500, 'Error checking product name uniqueness');
        }
    }
} 