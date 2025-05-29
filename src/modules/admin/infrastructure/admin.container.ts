import { AdminController } from './admin.controller';
import { AdminUseCase } from '../application/admin.usecase';
import { AdminRepository } from './admin.repository';
import { IAdminRepository } from '../domain/repositories/admin.repository.interface';

export class AdminContainer {
  private static instance: AdminContainer;
  private adminController: AdminController;

  private constructor() {
    const adminRepository: IAdminRepository = new AdminRepository();
    const adminUseCase = new AdminUseCase(adminRepository);
    this.adminController = new AdminController(adminUseCase);
  }

  public static getInstance(): AdminContainer {
    if (!AdminContainer.instance) {
      AdminContainer.instance = new AdminContainer();
    }
    return AdminContainer.instance;
  }

  public getAdminController(): AdminController {
    return this.adminController;
  }
} 