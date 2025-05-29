import { NextFunction, Request, Response } from 'express';
import { AdminUseCase } from '../application/admin.usecase';
import { ApiResponse } from '../../../utils/ApiResponse';
import passport from '../../../config/passport';

export class AdminController {
  constructor(private readonly adminUseCase: AdminUseCase) {}

  async registerAdmin(req: Request, res: Response) {
    try {
      const admin = await this.adminUseCase.registerAdmin(req.body);
      res.status(201).json(new ApiResponse(201, admin));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err: any, admin: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (!admin) {
        return res.status(401).json({ message: 'invalid credential' });
      }

      req.login(admin, (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        return res.json({
          success: true,
          data: { admin }
        });
      });
    })(req, res, next);
  }

  async getAllAdmins(req: Request, res: Response) {
    try {
      const query = req.query;
      const admins = await this.adminUseCase.getAllAdmins(query);
      res.json(new ApiResponse(200, admins));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAdminById(req: Request, res: Response) {
    try {
      const admin = await this.adminUseCase.getAdminById(req.params.id);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      res.json(new ApiResponse(200, admin));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateAdmin(req: Request, res: Response) {
    try {
      const admin = await this.adminUseCase.updateAdmin(req.params.id, req.body);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      res.json(new ApiResponse(200, admin));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteAdmin(req: Request, res: Response) {
    try {
      const admin = await this.adminUseCase.deleteAdmin(req.params.id);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      res.json(new ApiResponse(200, { message: 'Admin deleted successfully' }));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSuperAdmins(req: Request, res: Response) {
    try {
      const superAdmins = await this.adminUseCase.getSuperAdmins();
      res.json(new ApiResponse(200, superAdmins));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async changeAdminStatus(req: Request, res: Response) {
    try {
      const { isActive } = req.body;
      const admin = await this.adminUseCase.changeAdminStatus(req.params.id, isActive);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      res.json(new ApiResponse(200, admin));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async checkSuperAdmin(req: Request, res: Response) {
    try {
      const hasSuperAdmin = await this.adminUseCase.hasSuperAdmin();
      res.json(new ApiResponse(200, { hasSuperAdmin }));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async logoutAdmin(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }

        res.clearCookie('connect.sid');
        res.json({
          success: true,
          message: 'logout successfully'
        });
      });
    });
  }
}