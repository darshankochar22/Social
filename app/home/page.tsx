"use client";

import Link from "next/link";
import PostCard from "@/app/components/post-card";
import type { Post } from "@/app/components/post-card";

const users = [
  { handle: "@sarah_anderson", avatar: "", verified: true },
  { handle: "@alex", avatar: "", verified: false },
  { handle: "@mia", avatar: "", verified: false },
];

const sampleImages = [
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529336953121-ad5a0d43d0d2?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
];

const sampleContents = [
  "Morning yoga session complete ✨ Remember: self‑care isn't selfish, it's essential!",
  "Design sprint week – bringing ideas to life!",
  "Sunset run hits different.",
  "Coffee + code = perfect morning.",
  "Weekend hike to recharge. 🌲",
  "Launching something exciting soon.",
  "Sketching new concepts tonight.",
  "Shipping small, iterating fast.",
];

const feed: Post[] = Array.from({ length: 25 }, (_, idx) => {
  const i = idx + 1;
  const img = sampleImages[idx % sampleImages.length];
  const content = sampleContents[idx % sampleContents.length];
  return {
    id: i,
    content,
    image: img,
    likes: Math.floor(100 + Math.random() * 900),
    comments: Math.floor(10 + Math.random() * 200),
    timestamp: ["5m", "1h", "3h", "12h", "1d", "2d"][idx % 6],
  };
});

export default function HomeFeed() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {feed.map((post, i) => (
        <div key={post.id} className="relative">
          <PostCard post={post} />
          <Link
            href={`/post?id=${post.id}&content=${encodeURIComponent(post.content)}&image=${encodeURIComponent(
              post.image ?? ""
            )}&likes=${post.likes}&commentCount=${post.comments}&time=${encodeURIComponent(post.timestamp)}`}
            className="absolute inset-0"
            aria-label="Open post"
          />
        </div>
      ))}
    </main>
  );
}


