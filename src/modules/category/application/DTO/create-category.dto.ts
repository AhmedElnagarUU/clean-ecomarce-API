export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
} 