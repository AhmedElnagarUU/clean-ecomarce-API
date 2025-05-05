import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';

export class ProductController {
  constructor(private productService: ProductService) {}

  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await this.productService.getAllProducts();
    console.log(products)
    return res.json(new ApiResponse(200, products, 'Products fetched successfully'));
  });

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    return res.json(new ApiResponse(200, product, 'Product fetched successfully'));
  });

  createProduct = asyncHandler(async (req: Request, res: Response) => {
    console.log('product data',req.body);
    const product = await this.productService.createProduct(req.body);
    return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
  });

  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.updateProduct(id, req.body);
    return res.json(new ApiResponse(200, product, 'Product updated successfully'));
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.productService.deleteProduct(id);
    return res.json(new ApiResponse(200, null, 'Product deleted successfully'));
  });

  updateProductStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const product = await this.productService.updateProductStatus(id, status);
    return res.json(new ApiResponse(200, product, 'Product status updated successfully'));
  });
}