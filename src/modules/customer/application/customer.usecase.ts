import { Customer } from '../domain/entities/customer.entity';
import { ICustomerRepository } from '../domain/customer.repository.interface';
import { CreateCustomerDto } from './DTO/create-customer.dto';
import { UpdateCustomerDto } from './DTO/update-customer.dto';
import { ApiError } from '../../../utils/ApiError';

export class CustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async getAllCustomers(): Promise<Customer[]> {
    try {
      return await this.customerRepository.findAll();
    } catch (error) {
      // Log error appropriately
      throw new ApiError(500, 'Error fetching customers');
    }
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      const customer = await this.customerRepository.findById(id);
      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }
      return customer;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      // Log error appropriately
      throw new ApiError(500, 'Error fetching customer by ID');
    }
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    try {
      const customer = await this.customerRepository.findByEmail(email);
      // It's okay if customer is null here, means not found
      return customer;
    } catch (error) {
      // Log error appropriately
      throw new ApiError(500, 'Error fetching customer by email');
    }
  }

  async createCustomer(dto: CreateCustomerDto): Promise<Customer> {
    try {
      const existingCustomer = await this.customerRepository.findByEmail(dto.email);
      if (existingCustomer) {
        throw new ApiError(400, 'Customer with this email already exists');
      }
      // Type assertion might be needed if repository create method expects more fields
      return await this.customerRepository.create(dto as Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      // Log error appropriately
      throw new ApiError(500, 'Error creating customer');
    }
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto): Promise<Customer | null> {
    try {
      const existingCustomer = await this.customerRepository.findById(id);
      if (!existingCustomer) {
        throw new ApiError(404, 'Customer not found to update');
      }

      if (dto.email && dto.email !== existingCustomer.email) {
        const customerWithNewEmail = await this.customerRepository.findByEmail(dto.email);
        if (customerWithNewEmail) {
          throw new ApiError(400, 'Another customer with this email already exists');
        }
      }
      
      return await this.customerRepository.update(id, dto);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      // Log error appropriately
      throw new ApiError(500, 'Error updating customer');
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const existingCustomer = await this.customerRepository.findById(id);
      if (!existingCustomer) {
        throw new ApiError(404, 'Customer not found to delete');
      }
      return await this.customerRepository.delete(id);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      // Log error appropriately
      throw new ApiError(500, 'Error deleting customer');
    }
  }
}