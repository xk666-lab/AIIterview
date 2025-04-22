// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// 定义User文档接口
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // 默认查询不返回密码
  }
}, {
  timestamps: true
});

// 在保存前哈希密码
UserSchema.pre('save', async function(next) {
  // 只有密码被修改时才重新哈希
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 验证密码方法
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 避免TS中的模型重复定义错误
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;