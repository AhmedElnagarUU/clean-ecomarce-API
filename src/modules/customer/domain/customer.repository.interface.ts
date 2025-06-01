import { Customer } from './entities/customer.entity';

export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
  update(id: string, customer: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Customer | null>;
  delete(id: string): Promise<boolean>;
}