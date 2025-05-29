import { Admin, AdminProfile } from '../entities/admin.entity';

export interface IAdminRepository {
  create(admin: Admin): Promise<Admin>;
  findById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  update(id: string, admin: Partial<Admin>): Promise<Admin | null>;
  delete(id: string): Promise<Admin | null>;
  getAll(query?: any): Promise<Admin[]>;
  getAdminProfile(id: string): Promise<AdminProfile | null>;
  updateLastLogin(id: string): Promise<void>;
  changeStatus(id: string, isActive: boolean): Promise<Admin | null>;
  hasSuperAdmin(): Promise<boolean>;
} 