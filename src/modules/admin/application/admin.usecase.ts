import { IAdminRepository } from '../domain/repositories/admin.repository.interface';
import { IAdminUseCase } from '../domain/usecases/admin.usecase.interface';
import { Admin, AdminProfile, AdminRole } from '../domain/entities/admin.entity';
import { RegisterAdminDto, UpdateAdminDto } from '../domain/dtos/admin.dto';
import bcrypt from 'bcryptjs';

export class AdminUseCase implements IAdminUseCase {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async registerAdmin(adminData: Partial<Admin>): Promise<Admin> {
    // Set default permissions based on role
    if (!adminData.permissions) {
      adminData.permissions = adminData.role === AdminRole.SUPER_ADMIN 
        ? ['all'] 
        : ['read', 'write'];
    }

    // Hash password
    if (adminData.password) {
      adminData.password = await bcrypt.hash(adminData.password, 10);
    }

    return await this.adminRepository.create(adminData as Admin);
  }

  async getAllAdmins(query: any = {}): Promise<Admin[]> {
    return await this.adminRepository.getAll(query);
  }

  async getAdminById(id: string): Promise<Admin | null> {
    return await this.adminRepository.findById(id);
  }

  async getAdminByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findByEmail(email);
  }

  async updateAdmin(id: string, updateData: Partial<Admin>): Promise<Admin | null> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Prevent role change from super_admin if it's the last one
    if (admin.role === AdminRole.SUPER_ADMIN && updateData.role === AdminRole.ADMIN) {
      const superAdminCount = await this.adminRepository.hasSuperAdmin();
      if (!superAdminCount) {
        throw new Error('Cannot change role: At least one super admin must exist');
      }
    }

    return await this.adminRepository.update(id, updateData);
  }

  async deleteAdmin(id: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Prevent deletion of last super admin
    if (admin.role === AdminRole.SUPER_ADMIN) {
      const superAdminCount = await this.adminRepository.hasSuperAdmin();
      if (!superAdminCount) {
        throw new Error('Cannot delete: At least one super admin must exist');
      }
    }

    return await this.adminRepository.delete(id);
  }

  async getSuperAdmins(): Promise<Admin[]> {
    return await this.adminRepository.getAll({ role: AdminRole.SUPER_ADMIN });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.adminRepository.updateLastLogin(id);
  }

  async changeAdminStatus(id: string, isActive: boolean): Promise<Admin | null> {
    return await this.adminRepository.changeStatus(id, isActive);
  }

  async hasSuperAdmin(): Promise<boolean> {
    return await this.adminRepository.hasSuperAdmin();
  }

  async getAdminProfile(id: string): Promise<AdminProfile | null> {
    return await this.adminRepository.getAdminProfile(id);
  }
} 