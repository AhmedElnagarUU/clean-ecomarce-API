import { Schema, model, Document } from 'mongoose';

export interface CustomerDocument extends Document {
  // id is part of Document
  name: string;
  email: string;
  phone?: string;
  createdAt: Date; // Mongoose 'timestamps: true' will handle this
  updatedAt: Date; // Mongoose 'timestamps: true' will handle this
  // updatedAt will also be handled by timestamps
}

const customerSchema = new Schema<CustomerDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  // createdAt is handled by timestamps
}, {
  timestamps: true // This adds createdAt and updatedAt
});

export const CustomerModel = model<CustomerDocument>('Customer', customerSchema);