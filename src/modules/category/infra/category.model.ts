import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '../domain/entities/category.entity';
import slugify from 'slugify';

export interface CategoryDocument extends Omit<Category, 'id'>, Document {}

export interface ICategory {
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

export const CategoryModel = mongoose.model<CategoryDocument>('Category', categorySchema);