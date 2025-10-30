"use client";

import Reel from '@/app/components/reel';
import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

type ReelViewProps = {
  src: string;
  title?: string;
  category?: string;
  id?: string;
};

export default function ReelView({ src, title = '', category = 'Reel', id = 'reel-demo' }: ReelViewProps) {
  const [likes, setLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

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

  const likeReel = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const accountId = await getAccountId();
      const res = await fetch('/api/likes?count=1&targetType=reel&targetId=' + encodeURIComponent(id));
      if (res.ok) {
        const { count } = await res.json();
        setLikes(count);
      }
      const postRes = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType: 'reel', targetId: id, accountId })
      });
      if (postRes.ok) setLikes((c) => c + 1);
    } finally {
      setIsLiking(false);
    }
  };

  const hasSrc = !!src && src.trim().length > 0;

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center py-8">
      <div className="relative mx-auto">
        {hasSrc ? (
          <Reel src={src} title={title} category={category} />
        ) : (
          <div className="relative aspect-[9/16] h-[80vh] max-h-[80vh] overflow-hidden rounded-3xl bg-zinc-800 ring-1 ring-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-zinc-300 text-sm">Video unavailable</span>
            </div>
          </div>
        )}
        {/* right action bar */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 space-y-4 text-white">
          <button onClick={likeReel} disabled={isLiking} className="flex flex-col items-center text-white/90 hover:text-white"><Heart className="h-6 w-6" /><span className="text-xs">{likes}</span></button>
          <button className="flex flex-col items-center text-white/90 hover:text-white"><MessageCircle className="h-6 w-6" /><span className="text-xs">Comment</span></button>
          <button className="flex flex-col items-center text-white/90 hover:text-white"><Send className="h-6 w-6" /><span className="text-xs">Share</span></button>
          <button className="flex flex-col items-center text-white/90 hover:text-white"><Bookmark className="h-6 w-6" /><span className="text-xs">Save</span></button>
        </div>
        {/* bottom caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
          <p className="max-w-[22rem] text-sm font-medium text-white">{title || 'Reel title or caption goes here'}</p>
        </div>
      </div>
    </div>
  );
}


