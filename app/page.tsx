import Image from "next/image";
import hero from "./assets/5bfcd9dae5d6df40ef6aa9a64c657e820faa134f7c9a4daee902301c52acfe36.jpg";
import Testimonials from "./components/testimonials";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh]">
        <div className="absolute inset-0 -z-10">
          <Image
            src={hero}
            alt="Hero"
            priority
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl font-semibold sm:text-5xl lg:text-6xl">A world reimagined—crafted without compromise</h1>
            <p className="mt-4 text-sm text-white/80 sm:text-base lg:text-lg">
              Bold visuals. Quiet confidence. Space for what truly matters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#get-started" className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black shadow hover:bg-white/90">
                Get started
              </a>
              <a href="#learn-more" className="rounded-md bg-white/10 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-white/15">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white">
            <h3 className="text-base font-semibold">Fast setup</h3>
            <p className="mt-2 text-sm text-white/70">Start quickly with prebuilt styles and components.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white">
            <h3 className="text-base font-semibold">Accessible</h3>
            <p className="mt-2 text-sm text-white/70">Thoughtful defaults and keyboard-friendly interactions.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white">
            <h3 className="text-base font-semibold">Customizable</h3>
            <p className="mt-2 text-sm text-white/70">Adapt styles to match your brand with ease.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </>
  );
}
