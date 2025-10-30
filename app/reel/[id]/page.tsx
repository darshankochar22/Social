"use client";

import { useEffect, useState } from "react";
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
  const [reel, setReel] = useState<DbReel | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/reels/${encodeURIComponent(String(id))}`, { cache: 'no-store' });
        if (!r.ok) { setLoading(false); return; }
        const data = await r.json();
        setReel({ _id: String(data._id), videoUrl: data.videoUrl, caption: data.caption || null });
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!reel) return <div className="p-6">Reel not found. <button className="text-blue-600 underline" onClick={() => router.back()}>Back</button></div>;

  return <ReelView src={reel.videoUrl} title={reel.caption || ''} id={reel._id} />;
}


