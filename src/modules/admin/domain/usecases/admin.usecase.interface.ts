import { Admin, AdminProfile } from '../entities/admin.entity';

export interface IAdminUseCase {
  registerAdmin(adminData: Partial<Admin>): Promise<Admin>;
  getAllAdmins(query?: any): Promise<Admin[]>;
  getAdminById(id: string): Promise<Admin | null>;
  getAdminByEmail(email: string): Promise<Admin | null>;
  updateAdmin(id: string, updateData: Partial<Admin>): Promise<Admin | null>;
  deleteAdmin(id: string): Promise<Admin | null>;
  getSuperAdmins(): Promise<Admin[]>;
  updateLastLogin(id: string): Promise<void>;
  changeAdminStatus(id: string, isActive: boolean): Promise<Admin | null>;
  hasSuperAdmin(): Promise<boolean>;
  getAdminProfile(id: string): Promise<AdminProfile | null>;
} 