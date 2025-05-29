export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images?: string[];
    status?: 'active' | 'inactive';
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface UpdateProductStatusDTO {
    status: 'active' | 'inactive';
}

export interface ProductQueryDTO {
    page?: number;
    
    limit?: number;
    category?: string;
    status?: 'active' | 'inactive';
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

export interface DeleteProductDTO {
    id: string;
} 