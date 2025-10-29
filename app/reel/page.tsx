"use client";

import { useSearchParams } from "next/navigation";
import ReelView from "@/app/components/reel-view";

export default function ReelPage() {
  const sp = useSearchParams();
  const src = sp.get("src") ?? "";
  const title = sp.get("title") ?? "";
  const category = sp.get("category") ?? "Reel";
  const comments = [
    { id: 1, author: "Ava", handle: "@ava", text: "Amazing shot!", time: "3h" },
    { id: 2, author: "Leo", handle: "@leo", text: "🔥🔥", time: "5h" },
  ];

  return <ReelView src={src} title={title} category={category} comments={comments} />;
}


