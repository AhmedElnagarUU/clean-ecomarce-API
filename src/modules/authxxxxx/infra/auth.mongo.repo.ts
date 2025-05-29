import { IAuthRepository } from '../domain/auth.repository.interface';
import { User, UserProfile } from '../domain/entities/user.entity';
import { UserModel } from './user.model';

export class AuthMongoRepository implements IAuthRepository {
  async create(user: User): Promise<User> {
    const newUser = await UserModel.create(user);
    return newUser.toObject();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? user.toObject() : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? user.toObject() : null;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: user },
      { new: true }
    );
    return updatedUser ? updatedUser.toObject() : null;
  }

  async updatePassword(id: string, password: string): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          password,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    return updatedUser ? updatedUser.toObject() : null;
  }

  async updateResetPasswordToken(id: string, token: string, expires: Date): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          resetPasswordToken: token,
          resetPasswordExpires: expires,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    return updatedUser ? updatedUser.toObject() : null;
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
    return user ? user.toObject() : null;
  }

  async getUserProfile(id: string): Promise<UserProfile | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;

    const { password, resetPasswordToken, resetPasswordExpires, ...profile } = user.toObject();
    return profile;
  }
} 