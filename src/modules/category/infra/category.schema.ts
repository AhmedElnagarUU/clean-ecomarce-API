import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(2, 'Name must be at least 2 characters'),
    description: z.string({
      required_error: 'Description is required',
    }).min(10, 'Description must be at least 10 characters'),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Category ID is required',
    }),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const updateCategoryStatusSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Category ID is required',
    }),
  }),
  body: z.object({
    status: z.enum(['active', 'inactive'], {
      required_error: 'Status must be either active or inactive',
    }),
  }),
});