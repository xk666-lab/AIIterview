// components/Navbar.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 页面加载时获取用户信息
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        router.push('/');
        router.refresh(); // 刷新页面以更新状态
      }
    } catch (error) {
      console.error('退出登录失败', error);
      toast.error('退出登录失败，请重试');
    }
  };
  
  return (
    <nav className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" height={32} width={38} />
        <Link href="/" className="text-xl font-semibold">PrepWise</Link>
      </div>
      
      <div className="flex items-center gap-4">
        {loading ? (
          <span>加载中...</span>
        ) : user ? (
          <>
            <span>欢迎, {user?.name || ''}</span>
            <button 
              onClick={handleSignOut}
              className="btn-secondary"
            >
              退出登录
            </button>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="btn-link">
              登录
            </Link>
            <Link href="/sign-up" className="btn-primary">
              注册
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}