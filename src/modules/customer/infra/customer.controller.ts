import { Request, Response } from 'express';
import { CustomerUseCase } from '../application/customer.usecase';
import { CreateCustomerDto } from '../application/DTO/create-customer.dto';
import { UpdateCustomerDto } from '../application/DTO/update-customer.dto';
import { ApiResponse } from '../../../utils/ApiResponse';
import { ApiError } from '../../../utils/ApiError'; // Assuming ApiError is used for structured errors
import { asyncHandler } from '../../../utils/asyncHandler'; // For cleaner async route handlers

export class CustomerController {
  constructor(private readonly customerUseCase: CustomerUseCase) {}

  getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
    const customers = await this.customerUseCase.getAllCustomers();
    res.status(200).json(new ApiResponse(200, customers, 'Customers retrieved successfully'));
  });

  getCustomerById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = await this.customerUseCase.getCustomerById(id);
    // getCustomerById in use case already throws ApiError if not found
    res.status(200).json(new ApiResponse(200, customer, 'Customer retrieved successfully'));
  });

  createCustomer = asyncHandler(async (req: Request, res: Response) => {
    const dto: CreateCustomerDto = req.body;
    const newCustomer = await this.customerUseCase.createCustomer(dto);
    res.status(201).json(new ApiResponse(201, newCustomer, 'Customer created successfully'));
  });

  updateCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto: UpdateCustomerDto = req.body;
    const updatedCustomer = await this.customerUseCase.updateCustomer(id, dto);
    // updateCustomer in use case already throws ApiError if not found
    res.status(200).json(new ApiResponse(200, updatedCustomer, 'Customer updated successfully'));
  });

  deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.customerUseCase.deleteCustomer(id);
    // deleteCustomer in use case already throws ApiError if not found
    res.status(200).json(new ApiResponse(200, null, 'Customer deleted successfully')); // Or 204 with no content
  });
}