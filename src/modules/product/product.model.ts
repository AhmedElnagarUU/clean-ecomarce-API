import { Schema, model, Document } from 'mongoose';
import slugify from 'slugify';

export interface IProduct extends Document {
  name: string;
  description: string;
  slug: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    slug: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    images: [{
      type: String,
      required: true
    }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

export const Product = model<IProduct>('Product', productSchema); 