type ReelProps = {
  src: string;
  title?: string;
  category?: string;
  autoPlay?: boolean;
};

export default function Reel({ src, title = "", category = "", autoPlay = true }: ReelProps) {
  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-zinc-900 shadow-sm ring-1 ring-zinc-200/60">
      {/* media */}
      <video
        src={src}
        className="h-full w-full object-cover"
        muted
        playsInline
        loop
        preload="metadata"
        {...(autoPlay ? { autoPlay: true } : {})}
      />
      {/* overlay gradient like apple card */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      {/* labels */}
      <div className="absolute z-10 p-4">
        {category && <p className="text-xs font-medium text-white/90">{category}</p>}
        {title && <p className="mt-1 max-w-[12rem] text-left text-base font-semibold leading-tight text-white">{title}</p>}
      </div>
    </div>
  );
}


