import { Product } from '../domain/entities/product.entity';
import { IProductReposiory } from '../domain/product.repository.interface';
import { CreateProductDTO, UpdateProductDTO, ProductQueryDTO } from './DTO/product.dto';
import { getSignedFileUrl } from '../../../middleware/upload.middleware';



export interface ProductWithUrls {
  imageUrls: string[];
}

export class ProductUseCase {
  constructor(private readonly productRepository: IProductReposiory) {}

  private async addImageUrls(product: Product): Promise<ProductWithUrls> {
    try {
      const imageUrls = await Promise.all(
        product.images.map(imageKey => getSignedFileUrl(imageKey))
      );
      
      return {
        ...product.toDTO(),
        imageUrls
      };
    } catch (error) {
      console.error('Error generating image URLs:', error);
     
      return {
        ...product.toDTO(),
        imageUrls: []
      };
    }
  }
  
  private async addImageUrlsToProducts(products: Product[]): Promise<ProductWithUrls[]> {
    return Promise.all(products.map(p => this.addImageUrls(p)));
  }

  async getAllProducts(query?: ProductQueryDTO): Promise<ProductWithUrls[]> {
    const rawProducts = await this.productRepository.getAll(query);
    
    const products = rawProducts.map(product => Product.create(
      product.name,
      product.description,
      product.price,
      product.sku,
      product.stock,
      product.category,
      product.images,
      product.status,
      product.id
    ));      
    
    return this.addImageUrlsToProducts(products);
  }

  async getProductById(id: string): Promise<ProductWithUrls> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    return this.addImageUrls(product);
  }

  async createProduct(productData: CreateProductDTO): Promise<ProductWithUrls> {
    const { name, description, price, stock, category, images, status } = productData;
    const sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const product = Product.create(
      name,
      description,
      price,
      sku,
      stock,
      category,
      images ?? [],
      status
    );

    const created = await this.productRepository.create(product);
    return this.addImageUrls(created);
  }

  async updateProduct(id: string, productData: UpdateProductDTO): Promise<ProductWithUrls> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new Error('Product not found');

    const updated = Product.create(
      productData.name ?? existing.name,
      productData.description ?? existing.description,
      productData.price ?? existing.price,
      existing.sku,
      productData.stock ?? existing.stock,
      productData.category ?? existing.category,
      productData.images ?? existing.images,
      productData.status ?? existing.status
    );

    const result = await this.productRepository.update(id, updated);
    if (!result) throw new Error('Failed to update product');

    return this.addImageUrls(result);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    await this.productRepository.delete(id);
  }

  async updateStock(id: string, quantity: number): Promise<ProductWithUrls> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');

    product.updateStock(quantity);
    const updated = await this.productRepository.update(id, product);

    if (!updated) throw new Error('Failed to update stock');
    return this.addImageUrls(updated);
  }

  async updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<ProductWithUrls> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');

    product.status = status;
    const updated = await this.productRepository.update(id, product);
    if (!updated) throw new Error('Failed to update status');

    return this.addImageUrls(updated);
  }
}
