// import { Request, Response, NextFunction } from 'express';
// import { AuthService } from './auth.service';
// import passport from 'passport'




// export class AuthController {
  

//   static async registerAdmin(req: Request, res: Response) {
//     try {
//       const { email, password, name , role } = req.body;
//       const admin = await AuthService.registerAdmin( email, password, name , role );
//       res.status(201).json(admin);
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }
//   }


//   static async checkSuperAdmin(req: Request, res: Response) {
//     try {
//       const hasSuperAdmin = await AuthService.hasSuperAdmin();
//       res.status(200).json({
//         success: true,
//         data: {
//           exists: true
//         }
//       });
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }
//   }

//   static async loginAdmin(req: Request, res: Response , next:NextFunction) {
//    passport.authenticate('local', (err:any , admin:any, info:any) =>{
//      if(err) {
//       return res.status(500).json({message: err.message});
//      }

//      if(!admin) {
//       return res.status(401).json({message:'invalid credential' });
//      }

//      req.login(admin ,(err)=> {
//       if(err){
//         return res.status(500).json({message: err.message})
//       }

//       return res.json({
//         success:true,
//         data: {admin}
//       })
//      })
//    })(req, res, next)
//   }

 

//   static async logoutAdmin(req: Request, res: Response , next:NextFunction) {
//    req.logout((err)=>{
//     if(err){
//       return next(err);
//     }

//     req.session.destroy((err)=>{
//       if(err){
//         return next(err);
//       }
      
//       res.clearCookie('connect.sid');  
//       res.json({
//         success:true,
//         message:'logout successfully'
//       })
//     })

//    })
//   }

// } 