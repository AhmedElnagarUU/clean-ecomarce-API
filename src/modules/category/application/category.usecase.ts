import { ICategoryRepository } from '../domain/category.repository.interface';
import { Category } from '../domain/entities/category.entity';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';
import slugify from 'slugify';

export class CategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const slug = slugify(dto.name, { lower: true });
    const category: Partial<Category> = {
      ...dto,
      slug,
      isActive: dto.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.categoryRepository.create(category as Category);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category | null> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      return null;
    }

    const updateData: Partial<Category> = {
      ...dto,
      updatedAt: new Date(),
    };

    if (dto.name) {
      updateData.slug = slugify(dto.name, { lower: true });
    }

    return this.categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categoryRepository.delete(id);
  }
} 