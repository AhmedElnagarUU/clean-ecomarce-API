import { Schema, model, Document } from 'mongoose';

export interface CustomerDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

const customerSchema = new Schema<CustomerDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Customer = model<CustomerDocument>('Customer', customerSchema); 