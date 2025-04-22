import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "interview app",
  description: "chat in AI ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monaSans.className} dark antialiased  pattern`}>
        {/* 
        ${monaSans.className}
这是 Next.js 15.3.0 中的字体系统生成的特定类名
monaSans 是您通过 next/font 导入并配置的字体对象
.className 会生成一个唯一的类名,用于应用该字体
这个类名会自动包含所有必要的 font-family 设置
antialiased
这是一个用于改善字体渲染的 CSS 类
在现代浏览器中启用字体平滑效果
使文字看起来更清晰、更容易阅读
特别是在深色文字在浅色背景上时效果明显
这个类实际上应用了 CSS 属性 -webkit-font-smoothing: antialiased */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
