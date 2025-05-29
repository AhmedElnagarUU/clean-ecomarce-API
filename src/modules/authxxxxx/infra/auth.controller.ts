import { Request, Response } from 'express';
import { AuthUseCase } from '../application/auth.usecase';
import { RegisterDto } from '../application/DTO/register.dto';
import { LoginDto } from '../application/DTO/login.dto';
import { ResetPasswordDto } from '../application/DTO/reset-password.dto';
import { ApiResponse } from '../../../utils/ApiResponse';
import { IUser } from './user.model';



declare global {
  namespace Express {
    interface Request extends IUser {
      user?: IUser;
    }
  }
}


export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto: RegisterDto = req.body;
      const result = await this.authUseCase.register(dto);
      res.status(201).json(new ApiResponse(201, result));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto: LoginDto = req.body;
      const result = await this.authUseCase.login(dto);
      res.json(new ApiResponse(200, result));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authUseCase.forgotPassword(email);
      res.json(new ApiResponse(200, { message: 'Password reset email sent' }));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const dto: ResetPasswordDto = req.body;
      await this.authUseCase.resetPassword(dto);
      res.json(new ApiResponse(200, { message: 'Password reset successful' }));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const profile = await this.authUseCase.getProfile(userId);
      res.json(new ApiResponse(200, profile));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}