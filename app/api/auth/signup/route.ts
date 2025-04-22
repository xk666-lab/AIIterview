// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '此邮箱已被注册' },
        { status: 400 }
      );
    }
    
    // 创建新用户
    const user = await User.create({
      name,
      email,
      password // 密码将在保存前自动哈希
    });
    
    // 从响应中移除密码字段
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return NextResponse.json(
      { 
        success: true, 
        message: '账户创建成功，请登录', 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('创建用户失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || '创建账户失败，请重试' 
      },
      { status: 500 }
    );
  }
}