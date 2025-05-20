import { Product } from '../domain/entities/product.entity';
import { IProductReposiory } from '../domain/product.repository.interface';
import { CreateProductDTO, UpdateProductDTO, ProductQueryDTO } from './DTO/product.dto';

export class ProductUseCase {
    constructor(private readonly productRepository: IProductReposiory) {}

    async getAllProducts(query?: ProductQueryDTO): Promise<Product[]> {
        return await this.productRepository.getAll();
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(productData: CreateProductDTO): Promise<Product> {
        const { name, description, price, stock, category, status } = productData;
        
        // Generate a unique SKU
        const sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        const product = {
            name,
            description,
            price,
            sku,
            stock,
            category,
            images: [],
            status
        };

        return await this.productRepository.create(product);
    }

    async updateProduct(id: string, productData: UpdateProductDTO): Promise<Product> {
        const existingProduct = await this.getProductById(id);
        
        const updatedProduct = await this.productRepository.update(id, {
            ...existingProduct,
            ...productData
        });
        
        if (!updatedProduct) throw new Error('Failed to update product');
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await this.getProductById(id);
        await this.productRepository.delete(id);
    }
}
