import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../domain/entities/user.entity';

export interface UserDocument extends Omit<User, 'id'>, Document {}


export interface IUser extends UserDocument {
  id: string;
}




const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ resetPasswordToken: 1 });

export const UserModel = mongoose.model<UserDocument>('User', userSchema); 