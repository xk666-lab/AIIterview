// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 检查模型是否已经存在，避免Next.js开发环境下的热重载错误
const UserSchema = new mongoose.Schema({
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
    next(error);
  }
});

// 验证密码方法
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);