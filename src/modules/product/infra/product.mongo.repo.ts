import { ProductQueryDTO } from "../application/DTO/product.dto";
import { Product } from "../domain/entities/product.entity";
import { IProductReposiory } from "../domain/product.repository.interface";
import { Product as ProductModel } from "./product.model";

export class ProductMongoRepository implements IProductReposiory {
    async update(id: string, product: Partial<Product>): Promise<Product | null> {
        const updateData = product instanceof Product ? product.toDTO() : product;
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        return updatedProduct as unknown as Product;
    }

    async delete(id: string): Promise<boolean> {
        const result = await ProductModel.findByIdAndDelete(id);
        return !!result;
    }

    async create(product: Product): Promise<Product> {
        const newProduct = await ProductModel.create(product.toDTO());
        return newProduct as unknown as Product;
    }

    async findById(id: string): Promise<Product | null> {
        const product = await ProductModel.findById(id);
        return product as unknown as Product;
    }

    async getAll(query?:ProductQueryDTO): Promise<Product[]> {
        const products = await ProductModel.find();
        return products as unknown as Product[];
    }
}
