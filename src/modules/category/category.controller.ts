import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';


export class CategoryController  {

  constructor(private readonly categoryService: CategoryService) {}

  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.categoryService.getAllCategories();
    return res.json(new ApiResponse(200, categories));
  })

  getCategoryById = asyncHandler(async  (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await this.categoryService.getCategoryById(id);
    return res.json(new ApiResponse(200, category));
  })

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.createCategory(req.body);
    return res.status(201).json(new ApiResponse(201, category));
  })

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await this.categoryService.updateCategory(id, req.body);
    return res.json(new ApiResponse(200, category));
  })

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.categoryService.deleteCategory(id);
    return res.json(new ApiResponse(200, { message: 'Category deleted successfully' }));
  })

  updateCategoryStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const category = await this.categoryService.updateCategoryStatus(id, status);
    return res.json(new ApiResponse(200, category));
  })

  getCategoryNames = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.categoryService.getCategoryNames();
    return res.json(new ApiResponse(200, categories));
  })
}; 