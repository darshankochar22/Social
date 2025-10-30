"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ReelView from "@/app/components/reel-view";

type DbReel = {
  _id: string;
  videoUrl: string;
  caption?: string | null;
};

export default function ReelPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState<DbReel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        // Load all reels
        const allReelsRes = await fetch('/api/reels?limit=100', { cache: 'no-store' });
        if (!allReelsRes.ok) { setLoading(false); return; }
        const allReels = await allReelsRes.json();
        
        const reelsData = (allReels || []).map((r: any) => ({
          _id: String(r._id),
          videoUrl: r.videoUrl,
          caption: r.caption || null
        }));
        
        // Find the current reel index
        const index = reelsData.findIndex((r: DbReel) => r._id === id);
        if (index === -1) { setLoading(false); return; }
        
        setReels(reelsData);
        setCurrentIndex(index);
        hasScrolledRef.current = false;
      } finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (scrollContainerRef.current && reels.length > 0 && currentIndex >= 0 && !hasScrolledRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const reelHeight = window.innerHeight;
      scrollContainer.scrollTo({ top: currentIndex * reelHeight, behavior: 'instant' });
      hasScrolledRef.current = true;
    }
  }, [currentIndex, reels.length]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollPosition = scrollContainerRef.current.scrollTop;
    const reelHeight = window.innerHeight;
    const newIndex = Math.round(scrollPosition / reelHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
      setCurrentIndex(newIndex);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (reels.length === 0) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Reel not found. <button className="text-blue-600 underline" onClick={() => router.back()}>Back</button></div>;

  return (
    <div 
      ref={scrollContainerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      onScroll={handleScroll}
      onWheel={handleWheel}
    >
      {reels.map((reel) => (
        <div key={reel._id} className="h-screen snap-start snap-always">
          <ReelView src={reel.videoUrl} title={reel.caption || ''} id={reel._id} />
        </div>
      ))}
    </div>
  );
}


