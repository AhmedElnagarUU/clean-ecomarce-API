import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';

const categoryService = new CategoryService();

export const categoryController = {
  getAllCategories: asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    return res.json(new ApiResponse(200, categories));
  }),

  getCategoryById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    return res.json(new ApiResponse(200, category));
  }),

  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(new ApiResponse(201, category));
  }),

  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, req.body);
    return res.json(new ApiResponse(200, category));
  }),

  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return res.json(new ApiResponse(200, { message: 'Category deleted successfully' }));
  }),

  updateCategoryStatus: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const category = await categoryService.updateCategoryStatus(id, status);
    return res.json(new ApiResponse(200, category));
  }),

  getCategoryNames: asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.getCategoryNames();
    return res.json(new ApiResponse(200, categories));
  }),
}; 