"use client";

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Post = {
  id: string;
  author: string;
  handle: string;
  verified?: boolean;
  avatar: string;
  images: string[];
  caption: string;
  hashtags: string[];
  likes: number;
  timeAgo: string;
};

type Comment = {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
};

export default function PostView({ 
  post, 
  comments = [] 
}: { 
  post: Post; 
  comments?: Comment[] 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  const getAccountId = async (): Promise<string> => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const j = await res.json();
        return j?.account?._id || 'demo-account';
      }
    } catch {}
    return 'demo-account';
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const accountId = await getAccountId();
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "post", targetId: post.id, accountId })
      });
      if (res.ok) {
        setLikeCount((c) => c + 1);
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const text = commentText.trim();
    setCommentText("");
    const tempId = Date.now();
    setLocalComments((prev) => [
      { id: tempId, author: "You", avatar: post.avatar, text, timeAgo: "now" },
      ...prev,
    ]);
    try {
      const accountId = await getAccountId();
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "post", targetId: post.id, accountId, text })
      });
    } catch {}
  };

  return (
    <div className="min-h-screen w-full bg-white p-100 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Post Section */}
          <div className="md:col-span-7 lg:col-span-8 flex items-start justify-center bg-black relative">
            <div className="w-full aspect-square flex items-center justify-center relative">
              <Image 
                src={post.images[currentImageIndex]} 
                alt="Post content"
                fill
                className="object-contain"
              />
              
              {/* Navigation arrows for multiple images */}
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {post.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-1.5 rounded-full transition ${
                          idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-1.5'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Image counter */}
                  <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm z-10">
                    {currentImageIndex + 1} / {post.images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-5 lg:col-span-4 bg-white border-l border-zinc-200 flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <Image 
                  src={post.avatar} 
                  alt={post.author}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-zinc-900">{post.handle}</span>
                  {post.verified && (
                    <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  )}
                  <span className="text-sm text-zinc-500 ml-2">• Follow</span>
                </div>
              </div>
              <button className="text-zinc-900">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            {/* Comments Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Original Caption */}
              <div className="flex gap-3">
                <Image 
                  src={post.avatar} 
                  alt={post.author}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-zinc-900">{post.handle}</span>
                    <span className="text-xs text-zinc-400">{post.timeAgo}</span>
                  </div>
                  <p className="text-sm text-zinc-900 mt-1">
                    {post.caption}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.hashtags.map((tag, i) => (
                      <span key={i} className="text-sm text-blue-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments */}
              {localComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Image 
                    src={comment.avatar} 
                    alt={comment.author}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-zinc-900">{comment.author}</span>
                      <span className="text-xs text-zinc-400">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-zinc-900 mt-1">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Footer */}
            <div className="border-t border-zinc-200">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <button onClick={handleLike} disabled={isLiking} className="hover:opacity-60 transition">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="hover:opacity-60 transition">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button className="hover:opacity-60 transition">
                    <Send className="w-6 h-6" />
                  </button>
                </div>
                <button className="hover:opacity-60 transition">
                  <Bookmark className="w-6 h-6" />
                </button>
              </div>
              
              <div className="px-3 pb-2">
                <p className="text-sm font-semibold text-zinc-900">{likeCount.toLocaleString()} likes</p>
              </div>

              {/* Add Comment */}
              <div className="flex items-center gap-3 p-3 border-t border-zinc-200">
                <input 
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 text-sm outline-none"
                />
                <button onClick={handleAddComment} className="text-sm font-semibold text-blue-500 hover:text-blue-600">
                  Post
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}