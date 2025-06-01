import { Customer } from '../domain/entities/customer.entity';
import { ICustomerRepository } from '../domain/customer.repository.interface';
import { CustomerModel, CustomerDocument } from './customer.model'; // Assuming CustomerModel is the Mongoose model

export class CustomerMongoRepository implements ICustomerRepository {
  
  private toDomain(customerDoc: CustomerDocument): Customer {
    // Ensure _id is accessed directly from the document for safety
    // and other properties from its JSON representation or the doc itself.
    const id = customerDoc._id?.toString();
    const name = customerDoc.name;
    const email = customerDoc.email;
    const phone = customerDoc.phone;
    const createdAt = customerDoc.createdAt;
    const updatedAt = customerDoc.updatedAt;

    return {
      id,
      name,
      email,
      phone,
      createdAt,
      updatedAt,
    };
  }

  async findAll(): Promise<Customer[]> {
    const customerDocs = await CustomerModel.find().exec();
    return customerDocs.map(doc => this.toDomain(doc));
  }

  async findById(id: string): Promise<Customer | null> {
    const customerDoc = await CustomerModel.findById(id).exec();
    return customerDoc ? this.toDomain(customerDoc) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customerDoc = await CustomerModel.findOne({ email }).exec();
    return customerDoc ? this.toDomain(customerDoc) : null;
  }

  async create(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    // Mongoose will add _id, createdAt, updatedAt
    const newCustomerDoc = new CustomerModel(customerData);
    const savedDoc = await newCustomerDoc.save();
    return this.toDomain(savedDoc);
  }

  async update(id: string, customerData: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Customer | null> {
    const updatedDoc = await CustomerModel.findByIdAndUpdate(id, customerData, { new: true }).exec();
    return updatedDoc ? this.toDomain(updatedDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CustomerModel.findByIdAndDelete(id).exec();
    return !!result; // Returns true if a document was deleted, false otherwise
  }
}