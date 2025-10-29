"use client";

import Link from "next/link";

const reels: { src: string; title: string }[] = [
  { src: "https://videos.pexels.com/video-files/857195/857195-uhd_2560_1440_25fps.mp4", title: "Gallery stroll" },
  { src: "https://videos.pexels.com/video-files/2790150/2790150-uhd_2560_1440_25fps.mp4", title: "City lights" },
  { src: "https://videos.pexels.com/video-files/3064073/3064073-uhd_2560_1440_25fps.mp4", title: "Beach run" },
];

export default function Discover() {
  return (
    <main className="h-[100svh] w-full bg-black text-white">
      {/* Vertical snap scrolling like TikTok */}
      <div className="mx-auto flex h-full w-full max-w-[34rem] snap-y snap-mandatory flex-col overflow-y-scroll">
        {reels.map((r, i) => (
          <section key={i} className="relative h-[100svh] snap-start">
            <video
              src={r.src}
              className="h-full w-full object-cover"
              muted
              playsInline
              loop
              autoPlay
            />
            {/* open full-view page */}
            <Link
              href={`/reel?src=${encodeURIComponent(r.src)}&title=${encodeURIComponent(r.title)}&category=Discover`}
              className="absolute inset-0"
              aria-label="Open reel"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
              <p className="max-w-[20rem] text-sm font-medium">{r.title}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}


