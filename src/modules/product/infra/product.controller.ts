import { Request, Response } from 'express';
import { ProductUseCase } from '../application/product.usecase';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiResponse } from '../../../utils/ApiResponse';


export class ProductController {
  constructor(private productService: ProductUseCase) {}

  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await this.productService.getAllProducts();  
    console.log(`=======================================products  with json ================================================`);
    console.log(`products from controller: ${JSON.stringify(products, null, 2)}`);
    console.log(`=======================================products  with json================================================`);
    console.log(`=======================================products  with out json================================================`);
    console.log(`products from controller: ${products}`);
    console.log(`=======================================products  with ooout json================================================`);
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
    console.log('product controller',product);
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

  // updateProductStatus = asyncHandler(async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const { status } = req.body;
  //   const product = await this.productService.updateProductStatus(id, status);
  //   return res.json(new ApiResponse(200, product, 'Product status updated successfully'));
  // });
}