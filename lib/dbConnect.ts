/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('请在.env.local文件中定义MONGODB_URI环境变量');
}

// 声明全局mongoose对象类型
declare global {
  let mongooseGlobal: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// 为了在开发环境下避免重复连接，使用缓存连接
let cached = (global as any).mongooseGlobal;

if (!cached) {
  cached = (global as any).mongooseGlobal = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;