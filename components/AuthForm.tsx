"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "@/components/FormFiled";
import { useRouter } from "next/navigation";

type FormType = "sign-up" | "sign-in";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3, "姓名至少需要3个字符") : z.string().optional(),
    email: z.string().email("请输入有效的邮箱地址"),
    password: z.string().min(6, "密码至少需要6个字符"),
  });
};


export default function AuthForm({ type }: { type: FormType }) {
  // 
  const formSchema = authFormSchema(type);
  const isSignIn = type === "sign-in";
  const [isLoading, setIsLoading] = useState(false);
// 导入我们的路由
const router= useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // 判断是否是登录还是注册，根据这个来进行相应的路由操作
      const endpoint = isSignIn ? "/api/auth/signin" : "/api/auth/signup";
      // 发送请求
      const response = await fetch(endpoint, {
        //设置方式
        method: "POST",
        //设置请求头，
        //headers 是 HTTP 请求头配置对象
  // "Content-Type" 是一个 HTTP 头部字段，用来告诉服务器发送的数据类型
  // "application/json" 表示发送的数据是 JSON 格式
        headers: {
          "Content-Type": "application/json",
        },
        //它将 JavaScript 值（如对象、数组、字符串、数字等）转换为 JSON 格式的字符串
        body: JSON.stringify(values),
      });
      
      // 获取响应
      const data = await response.json();
      
      // 判断是否成功
      if (data.success) {
        toast.success(data.message);
        
        if (isSignIn) {
          // 登录成功后刷新页面并重定向到首页
          router.push('/');
          router.refresh(); // 重要：刷新页面以更新导航栏状态
        } else {
          // 注册成功后重定向到登录页
          router.push('/sign-in');
        }
      } else {
        toast.error(data.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("认证失败:", error);
      toast.error(error.message || "操作失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button type="submit" className="btn">
              {isSignIn ? "Sign in" : "Create an account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}




