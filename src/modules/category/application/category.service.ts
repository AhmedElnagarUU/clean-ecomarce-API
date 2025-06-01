import { ICategoryRepository } from '../domain/category.repository.interface';
import { Category } from '../domain/entities/category.entity';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';
import { ApiError } from '../../../utils/ApiError';
import slugify from 'slugify';

export class CategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.findAll();
    } catch (error) {
      throw new ApiError(500, 'Error fetching categories');
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching category');
    }
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    try {
      const slug = slugify(dto.name, { lower: true });
      const category: Partial<Category> = {
        ...dto,
        slug,
        isActive: dto.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await this.categoryRepository.create(category as Category);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error creating category');
    }
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    try {
      const existingCategory = await this.categoryRepository.findById(id);
      if (!existingCategory) {
        throw new ApiError(404, 'Category not found');
      }

      const updateData: Partial<Category> = {
        ...dto,
        updatedAt: new Date(),
      };

      if (dto.name) {
        updateData.slug = slugify(dto.name, { lower: true });
      }

      const updatedCategory = await this.categoryRepository.update(id, updateData);
      if (!updatedCategory) {
        throw new ApiError(404, 'Category not found');
      }

      return updatedCategory;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const success = await this.categoryRepository.delete(id);
      if (!success) {
        throw new ApiError(404, 'Category not found');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting category');
    }
  }

  async updateCategoryStatus(id: string, isActive: boolean): Promise<Category> {
    try {
      const existingCategory = await this.categoryRepository.findById(id);
      if (!existingCategory) {
        throw new ApiError(404, 'Category not found');
      }

      const updatedCategory = await this.categoryRepository.update(id, {
        isActive,
        updatedAt: new Date(),
      });

      if (!updatedCategory) {
        throw new ApiError(404, 'Category not found');
      }

      return updatedCategory;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating category status');
    }
  }

  async getCategoryNames(): Promise<string[]> {
    try {
      const categories = await this.categoryRepository.findAll();
      return categories
        .filter(category => category.isActive)
        .map((category: Category) => category.name);
    } catch (error) {
      throw new ApiError(500, 'Error fetching category names');
    }
  }
}