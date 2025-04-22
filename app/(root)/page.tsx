import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          {/* 
         // ❌ 不使用 asChild 的问题
<Button className="btn-primary">
  <Link href="/dashboard">
    进入控制台
  </Link>
</Button>
// 这会产生嵌套的可点击元素：<button><a>...</a></button>

// ✅ 使用 asChild 的正确方式
<Button asChild className="btn-primary">
  <Link href="/dashboard">
    进入控制台
  </Link>
</Button>
// 只会渲染：<a class="btn-primary">...</a>

          */}
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview"> Start an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robot-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2> Your Interview</h2>
        
        <div className="interviews-section">
        {dummyInterviews.map((interview) => (
          <InterviewCard key={interview.id} {...interview} />
        ))}

        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2> Take Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
        </div>
      </section>
    </>
  );
}
