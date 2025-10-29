"use client";

import { useSearchParams } from "next/navigation";
import PostView from "@/app/components/post-view";

export default function PostPage() {
  const sp = useSearchParams();
  const id = sp.get("id") ?? "0";
  const content = sp.get("content") ?? "";
  const image = sp.get("image") || "";
  const likes = Number(sp.get("likes") ?? 0);
  const timeAgo = sp.get("time") ?? "";

  const post = {
    id,
    author: "Sarah Anderson",
    handle: "@sarah_anderson",
    verified: true,
    avatar: "", // optional placeholder
    images: image ? [image] : [],
    caption: content,
    hashtags: [],
    likes,
    timeAgo,
  };

  const comments = [
    { id: 1, author: "Alex", handle: "@alex", text: "Love this!", time: "1h" },
    { id: 2, author: "Mia", handle: "@miamia", text: "So true.", time: "2h" },
  ];

  return <PostView post={post as any} comments={comments as any} />;
}


