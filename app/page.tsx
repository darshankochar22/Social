"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import heroLocal from "./assets/5bfcd9dae5d6df40ef6aa9a64c657e820faa134f7c9a4daee902301c52acfe36.jpg";
import Testimonials from "./components/testimonials";
import TrustedBy from "./components/trusted-by";
import AppleCardsCarouselDemo from "./components/apple-cards-carousel-demo";
import Footer from "./components/footer";

export default function Home() {
  const images = [
    heroLocal,
    "https://images.moneycontrol.com/static-mcnews/2025/06/20250629055740_Kirti-Kulhari-Sayani-Gupta-Maanvi-Gagroo-and-Bani-J-star-in-Four-More-Shots-Please.png?impolicy=website&width=1600&height=900",
  ] as const;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % images.length), 7000);
    return () => clearInterval(t);
  }, [images.length]);
  return (
    <>
      {/* Hero */}
      <section className="relative isolate min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh]">
        <div className="absolute inset-0 -z-10">
          <Image
            key={idx}
            src={images[idx]}
            alt="Hero"
            priority
            fill
            sizes="100vw"
            className="object-cover hero-fade"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
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

      {/* Apple Cards Carousel */}
      <AppleCardsCarouselDemo />

      {/* Testimonials */}
      <Testimonials />

      {/* Trusted By */}
      <TrustedBy />
      <Footer/>
    </>
  );
}
