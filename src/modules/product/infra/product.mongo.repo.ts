import { ProductQueryDTO } from "../application/DTO/product.dto";
import { Product } from "../domain/entities/product.entity";
import { IProductReposiory } from "../domain/product.repository.interface";
import { Product as ProductModel } from "./product.model";

export class ProductMongoRepository implements IProductReposiory {
    async update(id: string, product: Partial<Product>): Promise<Product | null> {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $set: product },
            { new: true, runValidators: true }
        );
        return updatedProduct ? updatedProduct.toObject() : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await ProductModel.findByIdAndDelete(id);
        return !!result;
    }

    async create(product: Product): Promise<Product> {
        const newProduct = await ProductModel.create(product);
        return newProduct.toObject();
    }

    async findById(id: string): Promise<Product | null> {
        const product = await ProductModel.findById(id);
        return product ? product.toObject() : null;
    }

    async getAll(query?:ProductQueryDTO): Promise<Product[]> {
        const products = await ProductModel.find();
        return products.map((product : any) => product.toObject());
    }
}
