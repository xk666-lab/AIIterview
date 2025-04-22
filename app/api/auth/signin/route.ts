/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// JWT密钥，生产环境应从环境变量获取
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const TOKEN_EXPIRY = '7d'; // 7天

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // 查找用户并包含密码字段用于验证
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: '邮箱或密码不正确' },
        { status: 400 }
      );
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: '邮箱或密码不正确' },
        { status: 400 }
      );
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
    
    // 设置Cookie
    (await
      // 设置Cookie
      cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
      sameSite: 'lax'
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
        message: '登录成功', 
        user: userWithoutPassword 
      }
    );
  } catch (error: any) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || '登录失败，请重试' 
      },
      { status: 500 }
    );
  }
}