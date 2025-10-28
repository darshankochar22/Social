export default function TrustedBy() {
  const logos = [
    "Google",
    "Microsoft",
    "Cisco",
    "Zomato",
    "Strapi",
    "Neon",
  ];
  const track = [...logos, ...logos];

  return (
    <section className="bg-linear-to-b from-white via-zinc-50 to-zinc-100 py-8">
      <div className="w-full px-6">
        {/* Edge transparency similar to testimonials */}
        <div className="relative text-zinc-500">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white/70 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-white/70 to-transparent z-10" />

          {/* Single horizontal marquee row */}
          <div className="marquee-mask">
            <div className="marquee-track marquee-animate-left py-2">
              {track.map((label, idx) => (
                <Logo key={`r1-${label}-${idx}`} label={label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Logo({ label }: { label: string }) {
  return (
    <div className="mx-12 flex h-16 shrink-0 items-center opacity-90 transition-opacity hover:opacity-100">
      <span
        className="whitespace-nowrap text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-[linear-gradient(90deg,theme(colors.zinc.400),theme(colors.zinc.500),theme(colors.zinc.300))] bg-[length:200%_200%] animate-gradient-x bg-clip-text drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
      >
        {label}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}


