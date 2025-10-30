"use client";

import Link from "next/link";
import Image from "next/image";

type DbReel = {
  _id: string;
  accountId: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  createdAt?: string | number | Date;
};

export default function ReelsGrid({ reels }: { reels: DbReel[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {reels.map((reel) => (
        <Link
          key={String(reel._id)}
          href={`/reel/${encodeURIComponent(String(reel._id))}`}
          className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-black transition-transform hover:scale-105"
        >
          {/* Video thumbnail or placeholder */}
          {reel.thumbnailUrl ? (
            <Image
              src={reel.thumbnailUrl}
              alt={reel.caption || "Reel"}
              fill
              className="object-cover transition-opacity group-hover:opacity-75"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            // Fallback: Use video element for thumbnail
            <video
              src={reel.videoUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          )}
          
          {/* Gradient overlay at bottom for caption */}
          {reel.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3">
              <p className="line-clamp-2 text-xs font-medium text-white">
                {reel.caption}
              </p>
            </div>
          )}
          
          {/* Play icon overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-70 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm transition-transform group-hover:scale-110">
              <svg
                className="h-8 w-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

