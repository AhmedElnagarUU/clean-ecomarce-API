import { Product } from '../entities/product.entity';

export interface IProductInteractor {
    // Basic CRUD operations
    getAllProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    createProduct(productData: {
        name: string;
        description: string;
        price: number;
        stock: number;
        category: string;
        images: string[];
    }): Promise<Product>;
    updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null>;
    deleteProduct(id: string): Promise<boolean>;

    // Business operations
    updateStock(id: string, quantity: number): Promise<Product | null>;
    updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<Product>;
    
    // Query operations
    getProductsByCategory(category: string): Promise<Product[]>;
    getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
    getActiveProducts(): Promise<Product[]>;
    searchProducts(query: string): Promise<Product[]>;
    
    // Stock operations
    checkStockAvailability(id: string, quantity: number): Promise<boolean>;
    reserveStock(id: string, quantity: number): Promise<boolean>;
    releaseStock(id: string, quantity: number): Promise<boolean>;
    
    // Validation operations
    validateProductData(productData: Partial<Product>): Promise<boolean>;
    isProductNameUnique(name: string, excludeId?: string): Promise<boolean>;
} 