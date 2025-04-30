import { NextFunction, Request, Response } from 'express';
import { AdminService } from './admin.service';
import { AdminRole } from './admin.model';
import passport from '../../config/passport';

export class AdminController {
  static async registerAdmin(req: Request, res: Response) {

    try {
      console.log(req.body);
      const admin = await AdminService.registerAdmin(req.body);
      console.log(admin);
      res.status(201).json({
        success: true,
        data: admin
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async loginAdmin(req: Request, res: Response , next:NextFunction) {
    console.log("this is come from loginAdmin");
    console.log(req.body);
    passport.authenticate('local', (err:any , admin:any, info:any) =>{
      if(err) {
       return res.status(500).json({message: err.message});
      }
 
      if(!admin) {
       return res.status(401).json({message:'invalid credential' });
      }
 
      req.login(admin ,(err)=> {
       if(err){
         return res.status(500).json({message: err.message})
       }
       console.log("this admin is come from admin");
 console.log(admin);
       return res.json({
         success:true,
         data: {admin}
       })
      })
    })(req, res, next)
   }


  static async getAllAdmins(req: Request, res: Response) {
    try {
      const query = req.query.role ? { role: req.query.role } : {};
      const admins = await AdminService.getAllAdmins(query);
      res.status(200).json({
        success: true,
        count: admins.length,
        data: admins
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAdminById(req: Request, res: Response) {
    try {
      const admin = await AdminService.getAdminById(req.params.id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }
      res.status(200).json({
        success: true,
        data: admin
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateAdmin(req: Request, res: Response) {
    try {
      const admin = await AdminService.updateAdmin(req.params.id, req.body);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }
      res.status(200).json({
        success: true,
        data: admin
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteAdmin(req: Request, res: Response) {
    try {
      const admin = await AdminService.deleteAdmin(req.params.id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Admin deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getSuperAdmins(req: Request, res: Response) {
    try {
      const superAdmins = await AdminService.getSuperAdmins();
      res.status(200).json({
        success: true,
        count: superAdmins.length,
        data: superAdmins
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async changeAdminStatus(req: Request, res: Response) {
    try {
      const { isActive } = req.body;
      const admin = await AdminService.changeAdminStatus(req.params.id, isActive);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }
      res.status(200).json({
        success: true,
        data: admin
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async checkSuperAdmin(req: Request, res: Response) {
    try {
      const hasSuperAdmin = await AdminService.hasSuperAdmin();
      res.status(200).json({
        success: true,
        data: {
          exists: hasSuperAdmin
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }



  static async logoutAdmin(req: Request, res: Response , next:NextFunction) {
    req.logout((err)=>{
     if(err){
       return next(err);
     }
 
     req.session.destroy((err)=>{
       if(err){
         return next(err);
       }
       
       res.clearCookie('connect.sid');  
       res.json({
         success:true,
         message:'logout successfully'
       })
     })
 
    })
   }
} 