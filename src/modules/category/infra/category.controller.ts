import { Request, Response } from 'express';
import { CategoryUseCase } from '../application/category.usecase';
import { CreateCategoryDto } from '../application/DTO/create-category.dto';
import { UpdateCategoryDto } from '../application/DTO/update-category.dto';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiResponse } from '../../../utils/ApiResponse';

export class CategoryController {
  constructor(private readonly categoryUseCase: CategoryUseCase) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateCategoryDto = req.body;
      const category = await this.categoryUseCase.createCategory(dto);
      res.status(201).json(new ApiResponse(201, category));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryUseCase.getCategoryById(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.json(new ApiResponse(200, category));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryUseCase.getAllCategories();
      res.json(new ApiResponse(200, categories));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateCategoryDto = req.body;
      const category = await this.categoryUseCase.updateCategory(id, dto);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.json(new ApiResponse(200, category));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.categoryUseCase.deleteCategory(id);
      if (!success) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  updateCategoryStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const category = await this.categoryUseCase.updateCategoryStatus(id, status);
    return res.json(new ApiResponse(200, category));
  })

  getCategoryNames = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.categoryUseCase.getCategoryNames();
    return res.json(new ApiResponse(200, categories));
  })
}