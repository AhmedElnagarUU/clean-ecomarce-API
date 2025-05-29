export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 