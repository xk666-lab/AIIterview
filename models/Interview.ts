// models/Interview.ts
import mongoose, { Document, Schema } from 'mongoose';

// 定义Interview文档接口
interface IInterview extends Document {
  role: string;
  type: string;
  level: string;
  techstack: string[];
  questions: string[];
  userId: string;
  finalized: boolean;
  coverImage: string;
  createdAt: string;
}

const InterviewSchema = new Schema<IInterview>({
  role: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  techstack: {
    type: [String],
    required: true
  },
  questions: {
    type: [String],
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  finalized: {
    type: Boolean,
    default: true
  },
  coverImage: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});

// 避免TS中的模型重复定义错误
const Interview = mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);

export default Interview;