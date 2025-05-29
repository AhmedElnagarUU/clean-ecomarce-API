import { IAuthRepository } from '../domain/auth.repository.interface';
import { User, UserProfile } from '../domain/entities/user.entity';
import { RegisterDto } from './DTO/register.dto';
import { LoginDto } from './DTO/login.dto';
import { ResetPasswordDto } from './DTO/reset-password.dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET } from '../../../config/constants';

export class AuthUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async register(dto: RegisterDto): Promise<{ user: UserProfile; token: string }> {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user: Partial<User> = {
      ...dto,
      password: hashedPassword,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newUser = await this.authRepository.create(user as User);
    const token = this.generateToken(newUser);
    const userProfile = this.mapToUserProfile(newUser);

    return { user: userProfile, token };
  }

  async login(dto: LoginDto): Promise<{ user: UserProfile; token: string }> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const token = this.generateToken(user);
    const userProfile = this.mapToUserProfile(user);

    return { user: userProfile, token };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await this.authRepository.updateResetPasswordToken(user.id, token, expires);
    // TODO: Send email with reset token
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.authRepository.findByResetPasswordToken(dto.token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error('Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.authRepository.updatePassword(user.id, hashedPassword);
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const profile = await this.authRepository.getUserProfile(userId);
    if (!profile) {
      throw new Error('User not found');
    }
    return profile;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  private mapToUserProfile(user: User): UserProfile {
    const { password, resetPasswordToken, resetPasswordExpires, ...profile } = user;
    return profile;
  }
} 