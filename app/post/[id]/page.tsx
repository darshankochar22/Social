"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostCard, { type Post } from "@/app/components/post-card";
import Link from "next/link";

export default function PostViewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<{ name?: string; username?: string; avatarUrl?: string | null }>({});

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/posts/${encodeURIComponent(String(id))}`, { cache: 'no-store' });
        if (!r.ok) { setLoading(false); return; }
        const p = await r.json();
        const mapped: Post = {
          id: String(p._id),
          content: p.content || p.title || '',
          image: p.imageUrl || null,
          images: p.imageUrl ? [p.imageUrl] : [],
          likes: 0,
          comments: 0,
          timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString() : ''
        };
        setPost(mapped);
        // fetch author profile
        if (p.accountId) {
          const pr = await fetch(`/api/profiles?accountId=${encodeURIComponent(p.accountId)}`, { cache: 'no-store' }).then(x => x.json());
          const profile = pr?.[0];
          setAuthor({ name: profile?.displayName || '', username: profile?.accountId, avatarUrl: profile?.avatarUrl || null });
        }
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!post) return <div className="p-6">Post not found. <Link className="text-blue-600 underline" href="/profile">Back</Link></div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <PostCard post={post} authorName={author.name} authorUsername={author.username} authorAvatarUrl={author.avatarUrl} />
    </div>
  );
}
