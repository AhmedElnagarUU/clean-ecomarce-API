import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(2, 'Name must be at least 2 characters'),
    description: z.string({
      required_error: 'Description is required',
    }).min(10, 'Description must be at least 10 characters'),
    price: z.number({
      required_error: 'Price is required',
    }).min(0, 'Price must be greater than or equal to 0'),
    stock: z.number({
      required_error: 'Stock is required',
    }).min(0, 'Stock must be greater than or equal to 0'),
    category: z.string({
      required_error: 'Category is required',
    }),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Product ID is required',
    }),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    price: z.number().min(0, 'Price must be greater than or equal to 0').optional(),
    stock: z.number().min(0, 'Stock must be greater than or equal to 0').optional(),
    category: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const updateProductStatusSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Product ID is required',
    }),
  }),
  body: z.object({
    status: z.enum(['active', 'inactive'], {
      required_error: 'Status must be either active or inactive',
    }),
  }),
}); 