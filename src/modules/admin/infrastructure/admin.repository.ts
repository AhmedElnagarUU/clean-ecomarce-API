import { IAdminRepository } from '../domain/repositories/admin.repository.interface';
import { Admin, AdminProfile, AdminRole } from '../domain/entities/admin.entity';
import { AdminModel } from './admin.model';

export class AdminRepository implements IAdminRepository {
  async create(admin: Admin): Promise<Admin> {
    const newAdmin = await AdminModel.create(admin);
    return newAdmin.toObject();
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await AdminModel.findById(id);
    return admin ? admin.toObject() : null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await AdminModel.findOne({ email });
    return admin ? admin.toObject() : null;
  }

  async update(id: string, admin: Partial<Admin>): Promise<Admin | null> {
    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { $set: admin },
      { new: true }
    );
    return updatedAdmin ? updatedAdmin.toObject() : null;
  }

  async delete(id: string): Promise<Admin | null> {
    const deletedAdmin = await AdminModel.findByIdAndDelete(id);
    return deletedAdmin ? deletedAdmin.toObject() : null;
  }

  async getAll(query: any = {}): Promise<Admin[]> {
    const admins = await AdminModel.find(query).sort({ createdAt: -1 });
    return admins.map(admin => admin.toObject());
  }

  async getAdminProfile(id: string): Promise<AdminProfile | null> {
    const admin = await AdminModel.findById(id);
    if (!admin) return null;

    const { password, refreshToken, ...profile } = admin.toObject();
    return profile;
  }

  async updateLastLogin(id: string): Promise<void> {
    await AdminModel.findByIdAndUpdate(id, {
      $set: { lastLogin: new Date() }
    });
  }

  async changeStatus(id: string, isActive: boolean): Promise<Admin | null> {
    const admin = await AdminModel.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    );
    return admin ? admin.toObject() : null;
  }

  async hasSuperAdmin(): Promise<boolean> {
    const superAdmin = await AdminModel.findOne({ role: AdminRole.SUPER_ADMIN });
    return !!superAdmin;
  }
} 