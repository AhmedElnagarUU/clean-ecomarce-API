import { Admin, IAdmin, AdminRole } from './admin.model';

export class AdminService {
  static async registerAdmin(adminData: Partial<IAdmin>): Promise<IAdmin> {
    try {
      // Set default permissions based on role
      if (!adminData.permissions) {
        adminData.permissions = adminData.role === AdminRole.SUPER_ADMIN 
          ? ['all'] 
          : ['read', 'write'];
      }

      const admin = new Admin(adminData);
      return await admin.save();
    } catch (error) {
      throw error;
    }
  }

  static async getAllAdmins(query: any = {}): Promise<IAdmin[]> {
    try {
      return await Admin.find(query).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  static async getAdminById(id: string): Promise<IAdmin | null> {
    try {
      return await Admin.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async getAdminByEmail(email: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findOne({ email }).select('+password');
      console.log("admin from mongodb service");
      console.log(admin);
      return admin;
    } catch (error) {
      throw error;
    }
  }


  static async updateAdmin(id: string, updateData: Partial<IAdmin>): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }

      // Prevent role change from super_admin if it's the last one
      if (admin.role === AdminRole.SUPER_ADMIN && updateData.role === AdminRole.ADMIN) {
        const superAdminCount = await Admin.countDocuments({ role: AdminRole.SUPER_ADMIN });
        if (superAdminCount <= 1) {
          throw new Error('Cannot change role: At least one super admin must exist');
        }
      }

      return await Admin.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  static async deleteAdmin(id: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }

      // Prevent deletion of last super admin
      if (admin.role === AdminRole.SUPER_ADMIN) {
        const superAdminCount = await Admin.countDocuments({ role: AdminRole.SUPER_ADMIN });
        if (superAdminCount <= 1) {
          throw new Error('Cannot delete: At least one super admin must exist');
        }
      }

      return await Admin.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  static async getSuperAdmins(): Promise<IAdmin[]> {
    try {
      return await Admin.find({ role: AdminRole.SUPER_ADMIN });
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(id: string): Promise<void> {
    try {
      await Admin.findByIdAndUpdate(id, {
        $set: { lastLogin: new Date() }
      });
    } catch (error) {
      throw error;
    }
  }

  static async changeAdminStatus(id: string, isActive: boolean): Promise<IAdmin | null> {
    try {
      return await Admin.findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  static async hasSuperAdmin(): Promise<boolean> {
    try {
      const superAdmin = await Admin.findOne({ role: AdminRole.SUPER_ADMIN });
      return !!superAdmin;
    } catch (error) {
      throw error;
    }
  }
} 