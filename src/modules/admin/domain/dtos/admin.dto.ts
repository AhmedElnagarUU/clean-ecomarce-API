import { AdminRole } from '../entities/admin.entity';

export interface RegisterAdminDto {
  name: string;
  email: string;
  password: string;
  role?: AdminRole;
  permissions?: string[];
}

export interface UpdateAdminDto {
  name?: string;
  email?: string;
  role?: AdminRole;
  permissions?: string[];
  isActive?: boolean;
}

export interface LoginAdminDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
} 