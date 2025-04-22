/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // 删除令牌cookie
    (await
      // 删除令牌cookie
      cookies()).delete('token');
    
    return NextResponse.json({
      success: true,
      message: '已成功退出登录'
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || '退出登录失败' 
      },
      { status: 500 }
    );
  }
}