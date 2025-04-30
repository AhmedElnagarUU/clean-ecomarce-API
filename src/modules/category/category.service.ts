import { Category, ICategory } from './category.model';
import { ApiError } from '../../utils/ApiError';

export interface CreateCategoryDTO {
  name: string;
  description: string;
  status?: 'active' | 'inactive';
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

export class CategoryService {
  async getAllCategories(): Promise<ICategory[]> {
    try {
      return await Category.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new ApiError(500, 'Error fetching categories');
    }
  }

  async getCategoryById(id: string): Promise<ICategory> {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching category');
    }
  }

  async createCategory(data: CreateCategoryDTO): Promise<ICategory> {
    try {
      const existingCategory = await Category.findOne({ name: data.name });
      if (existingCategory) {
        throw new ApiError(400, 'Category with this name already exists');
      }

      const category = new Category(data);
      return await category.save();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error creating category');
    }
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<ICategory> {
    try {
      if (data.name) {
        const existingCategory = await Category.findOne({ 
          name: data.name,
          _id: { $ne: id }
        });
        if (existingCategory) {
          throw new ApiError(400, 'Category with this name already exists');
        }
      }

      const category = await Category.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!category) {
        throw new ApiError(404, 'Category not found');
      }

      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting category');
    }
  }

  async updateCategoryStatus(id: string, status: 'active' | 'inactive'): Promise<ICategory> {
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
      );

      if (!category) {
        throw new ApiError(404, 'Category not found');
      }

      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating category status');
    }
  }

  async getCategoryNames(): Promise<string[]> {
    try {
      const categories = await Category.find({ status: 'active' }).select('name');
      return categories.map(category => category.name);
    } catch (error) {
      throw new ApiError(500, 'Error fetching category names');
    }
  }
} 