// import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
// import { AdminService } from '../admin/admin.service';
// import { AdminRole } from '../admin/admin.model';

// // I WILL NOT NEED THIS FILE BECAUSE I WILL DEPAND ON ATHER MODULES SERVICES TO HANDLE THE AUTHENTICATION AND AUTHORIZATION
// export class AuthService {
 

//   static async registerAdmin(email: string, password: string, name: string, role:AdminRole) {
//     const admin = await AdminService.createAdmin({ email, password, name, role });
//     return admin;
//   }
   
  

//   static async loginAdmin(email: string, password: string) {
//     console.log("email and password from auth.service");
//     console.log(email, password);
//     const admin = await AdminService.getAdminByEmail(email);
// console.log("admin from service");
// console.log(admin);

    
//     if (!admin) {
//       throw new Error('Invalid credentials');
//     }

//     const isPasswordValid = await admin.comparePassword(password);
//     if (!isPasswordValid) {
//       throw new Error('Invalid credentials');
//     }

    
//     // if (!admin.isActive) {
//     //   throw new Error('Account is disabled');
//     // }

//     return  admin
      
//   }




//   static async logoutAdmin(adminId: string) {
//     // Remove refresh token from database
//     await AdminService.updateAdmin(adminId, { 
//       refreshToken: undefined 
//     });
//   }


//   static async hasSuperAdmin(): Promise<boolean> {
//     try {
//       const superAdmin = await AdminService.getAdminByEmail('super_admin');
//       return !!superAdmin;
//     } catch (error) {
//       throw error;
//     }
//   }
  
// } 