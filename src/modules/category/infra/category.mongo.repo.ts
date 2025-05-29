import { ICategoryRepository } from '../domain/category.repository.interface';
import { Category } from '../domain/entities/category.entity';
import { CategoryModel } from './category.model';

export class CategoryMongoRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const newCategory = await CategoryModel.create(category);
    return newCategory.toObject();
  }

  async findById(id: string): Promise<Category | null> {
    const category = await CategoryModel.findById(id);
    return category ? category.toObject() : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await CategoryModel.find();
    return categories.map(category => category.toObject());
  }

  async update(id: string, category: Partial<Category>): Promise<Category | null> {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: category },
      { new: true }
    );
    return updatedCategory ? updatedCategory.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id);
    return !!result;
  }
} 