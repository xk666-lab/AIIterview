// app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  await dbConnect();
  
  try {
    const token = (await cookies()).get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }
    
    // 验证令牌
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // 获取用户信息，但不包括密码
    const user = await User.findById(decoded.id);
    
    if (!user) {
      (await cookies()).delete('token');
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // 令牌无效或过期
    (await
      // 令牌无效或过期
      cookies()).delete('token');
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || '会话已过期，请重新登录' 
      },
      { status: 401 }
    );
  }
}