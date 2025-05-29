import { User, UserProfile } from './entities/user.entity';

export interface IAuthRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  updatePassword(id: string, password: string): Promise<User | null>;
  updateResetPasswordToken(id: string, token: string, expires: Date): Promise<User | null>;
  findByResetPasswordToken(token: string): Promise<User | null>;
  getUserProfile(id: string): Promise<UserProfile | null>;
} 