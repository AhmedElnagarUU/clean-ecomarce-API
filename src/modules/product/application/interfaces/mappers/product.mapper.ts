import { Product } from '../entities/product.entity';
import { IProduct } from '../product.model';

export class ProductMapper {
    // Convert from database model to entity
    static toEntity(model: IProduct): Product {
        return new Product(
            model.name,
            model.description,
            model.price,
            model.stock,
            model.category,
            model.images,
            model.status,
            model._id?.toString(),
            model.createdAt,
            model.updatedAt
        );
    }

    // Convert from entity to database model
    static toModel(entity: Product): Partial<IProduct> {
        return {
            name: entity.name,
            description: entity.description,
            price: entity.price,
            stock: entity.stock,
            category: entity.category,
            images: entity.images,
            status: entity.status,
            slug: entity.slug
        };
    }

    // Convert array of models to entities
    static toEntities(models: IProduct[]): Product[] {
        return models.map(model => this.toEntity(model));
    }
} 