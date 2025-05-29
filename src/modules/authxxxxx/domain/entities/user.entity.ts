// export interface User {
//   id: string;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   role: 'user' | 'admin';
//   isActive: boolean;
//   resetPasswordToken?: string;
//   resetPasswordExpires?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 