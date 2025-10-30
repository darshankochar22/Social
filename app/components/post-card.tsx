"use client";

import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Comments from '@/app/components/comments';

export type Post = {
  id: number | string;
  content: string;
  image: string | null;
  images?: string[]; 
  likes: number;
  comments: number;
  timestamp: string;
};

type PostCardProps = {
  post: Post;
  authorName?: string;
  authorUsername?: string;
  authorAvatarUrl?: string | null;
  canDelete?: boolean;
  onDelete?: () => void;
};

export default function PostCard({ post, authorName, authorUsername, authorAvatarUrl, canDelete = false, onDelete }: PostCardProps) {
  // likes state
  const [likeCount, setLikeCount] = useState<number>(post.likes || 0);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(post.comments || 0);
  const [hasInitializedCount, setHasInitializedCount] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // total likes
        const totalRes = await fetch(`/api/likes?count=1&targetType=post&targetId=${encodeURIComponent(String(post.id))}`, { cache: 'no-store' });
        if (!cancelled && totalRes.ok) {
          const { count } = await totalRes.json();
          setLikeCount(typeof count === 'number' ? count : (post.likes || 0));
        }
        // total comments
        const comRes = await fetch(`/api/comments?count=1&targetType=post&targetId=${encodeURIComponent(String(post.id))}`, { cache: 'no-store' });
        if (!cancelled && comRes.ok) {
          const { count } = await comRes.json();
          setCommentCount(typeof count === 'number' ? count : (post.comments || 0));
        }
        // whether viewer has liked
        const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!cancelled && meRes.ok) {
          const me = await meRes.json();
          const viewerId = me?.account?._id;
          if (viewerId) {
            const likedRes = await fetch(`/api/likes?count=1&targetType=post&targetId=${encodeURIComponent(String(post.id))}&accountId=${encodeURIComponent(String(viewerId))}`, { cache: 'no-store' });
            if (!cancelled && likedRes.ok) {
              const { count: myCount } = await likedRes.json();
              setIsLiked((myCount || 0) > 0);
            }
          }
        }
        setHasInitializedCount(true);
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [post.id, post.likes]);

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
    if (isLiking || isLiked) return;
    setIsLiking(true);
    try {
      const accountId = await getAccountId();
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType: 'post', targetId: post.id, accountId })
      });
      if (res.status === 201) {
        setLikeCount(c => c + 1);
        setIsLiked(true);
      } // if 200, already liked -> do nothing
    } finally {
      setIsLiking(false);
    }
  };

  // Handle both single image and multiple images
  const images = post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : []);
  
  const renderImages = () => {
    if (images.length === 0) return null;
    
    if (images.length === 1) {
      // Single image - full width
      return (
        <div className="mt-3 relative w-full aspect-video overflow-hidden rounded-xl">
          <Image 
            src={images[0]} 
            alt="Post content" 
            fill
            className="object-cover"
          />
        </div>
      );
    }
    
    if (images.length === 2) {
      // Two images - side by side
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-xl">
              <Image 
                src={img} 
                alt={`Post content ${idx + 1}`} 
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );
    }
    
    if (images.length === 3) {
      // Three images - large + two small
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="relative row-span-2 aspect-square overflow-hidden rounded-xl">
            <Image 
              src={images[0]} 
              alt="Post content 1" 
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image 
              src={images[1]} 
              alt="Post content 2" 
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image 
              src={images[2]} 
              alt="Post content 3" 
              fill
              className="object-cover"
            />
          </div>
        </div>
      );
    }
    
    // Four or more images - grid with overlay
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {images.slice(0, 4).map((img, idx) => (
          <div key={idx} className="relative aspect-square overflow-hidden rounded-xl">
            <Image 
              src={img} 
              alt={`Post content ${idx + 1}`} 
              fill
              className="object-cover"
            />
            {idx === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <article className="rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
      <header className="mb-3 flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-purple-500 to-pink-500">
          {authorAvatarUrl ? (
            <img src={authorAvatarUrl} alt={authorName || authorUsername || 'avatar'} className="h-10 w-10 object-cover" />
          ) : null}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2"><span className="font-semibold text-gray-900">{authorName || authorUsername || 'User'}</span><span className="text-sm text-gray-500">{post.timestamp}</span></div>
          <p className="mt-2 text-gray-700">{post.content}</p>
          {renderImages()}
        </div>
      </header>
      <footer className="mt-4 flex items-center justify-center gap-8 md:justify-end">
        <button onClick={handleLike} disabled={isLiking || isLiked} className="flex items-center gap-2 text-gray-600 transition hover:text-pink-600 disabled:opacity-60">
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-pink-600 text-pink-600' : ''}`} />
          <span className="text-sm font-medium">{hasInitializedCount ? likeCount : (post.likes || 0)}</span>
        </button>
        <button onClick={() => setShowComments(s => !s)} className="flex items-center gap-2 text-gray-600 transition hover:text-blue-600">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{commentCount}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 transition hover:text-green-600">
          <Share2 className="h-5 w-5" />
        </button>
        {canDelete && (
          <button onClick={onDelete} className="flex items-center gap-2 text-gray-600 transition hover:text-red-600">
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </footer>
      {showComments && (
        <div className="mt-3">
          <Comments targetType="post" targetId={post.id} onCountChange={setCommentCount} />
        </div>
      )}
    </article>
  );
}


