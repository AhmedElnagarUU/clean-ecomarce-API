import { ICategoryRepository } from '../domain/category.repository.interface';
import { Category } from '../domain/entities/category.entity';
import { CategoryModel, CategoryDocument } from './category.model';
import mongoose from 'mongoose';

export class CategoryMongoRepository implements ICategoryRepository {
  private mapToDomain(categoryDoc: CategoryDocument): Category {
    return {
      id: (categoryDoc._id as mongoose.Types.ObjectId).toString(),
      name: categoryDoc.name,
      description: categoryDoc.description,
      slug: categoryDoc.slug,
      isActive: categoryDoc.isActive,
      createdAt: categoryDoc.createdAt,
      updatedAt: categoryDoc.updatedAt
    };
  }

  async create(category: Category): Promise<Category> {
    const newCategory = await CategoryModel.create(category);
    return this.mapToDomain(newCategory);
  }

  async findById(id: string): Promise<Category | null> {
    const category = await CategoryModel.findById(id);
    return category ? this.mapToDomain(category) : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await CategoryModel.find();
    return categories.map(this.mapToDomain);
  }

  async update(id: string, category: Partial<Category>): Promise<Category | null> {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: category },
      { new: true }
    );
    return updatedCategory ? this.mapToDomain(updatedCategory) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id);
    return !!result;
  }
} 