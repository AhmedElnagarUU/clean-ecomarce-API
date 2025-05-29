export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin'
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: Date;
  permissions: string[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: Date;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
} 