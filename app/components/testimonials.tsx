// Social icon removed per request

interface Testimonial {
  name: string;
  username: string;
  avatar: string;
  content: string;
  verified?: boolean;
}

const testimonials: Testimonial[] = [
  {
    name: "Rayhan Hossain Rahat",
    username: "@th_rahat_dev",
    avatar: "/avatars/rayhan.jpg",
    content: "Absolutely Awesome, Would really love to use some of these in my projects",
    verified: true
  },
  {
    name: "Paarth Agarwal",
    username: "@PaarthAgarwal7",
    avatar: "/avatars/paarth.jpg",
    content: "I just tried it out this is crazy awesome"
  },
  {
    name: "Micky",
    username: "@rasmickyy",
    avatar: "/avatars/micky.jpg",
    content: "Yoo.... This has to be the most beautiful component library I've ever seen!! ui.aceternity.com Shoutout to @mannupaaji for releasing this for free!",
    verified: true
  },
  {
    name: "iOS/MacOS Developer | Swift...",
    username: "@inLessmore",
    avatar: "/avatars/ios-dev.jpg",
    content: "I really like it.I will try to use it my next app"
  },
  {
    name: "Rajdeep Seth",
    username: "@rajdeepseth1",
    avatar: "/avatars/rajdeep.jpg",
    content: "Stumbled upon ui.aceternity.com today and my mind is blown 🤯\nThe seamless integration of framer-motion, tailwind CSS, and shadcn showcases a masterclass in UI design. 🚀 Kudos to @mannupaaji for creating such an innovative and inspirational resource for devs! #UI #nextjs"
  },
  {
    name: "Rumit Dhamecha • રુમિત ધામે...",
    username: "@potatopato",
    avatar: "/avatars/rumit.jpg",
    content: "I like the interaction and animation. Beautiful!"
  },
  {
    name: "Aamar",
    username: "@aamarkanji",
    avatar: "/avatars/aamar.jpg",
    content: "Man this is awesome",
    verified: true
  },
  {
    name: "Vinay",
    username: "@vinayisactive",
    avatar: "/avatars/vinay.jpg",
    content: "Upon my return from a short break every time, I consistently find innovative additions by you 🔥"
  },
  {
    name: "Rajesh David",
    username: "@rajeshdavidbabu",
    avatar: "/avatars/rajesh.jpg",
    content: "ui.aceternity.com\n\nSo well done. And its bloody free 🤪🤪\n\nPhenomenal work by @mannupaaji",
    verified: true
  },
  {
    name: "Cody De Arkland",
    username: "@CodydeArkland",
    avatar: "/avatars/cody.jpg",
    content: "This library is so dope. Stoked to see more components drop.",
    verified: true
  }
];

export default function Testimonials() {
  return (
    <section className="bg-linear-to-b from-white via-zinc-50 to-zinc-100 text-black pt-6 md:pt-8 pb-28 md:pb-32 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Vertical Marquee Columns */}
        <div className="relative h-[820px] md:h-[900px] overflow-hidden">
           {/* Top gradient fade */}
           <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-white via-white/70 to-transparent z-10 pointer-events-none" />
           
           {/* Bottom gradient fade */}
           <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white via-white/70 to-transparent z-10 pointer-events-none" />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full py-8">
            {/* Column 1 - moves up slowly */}
            <div className="flex flex-col gap-4 animate-scroll-up">
              {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <Card key={`c1-${i}`} t={t} />
              ))}
            </div>

            {/* Column 2 - moves down medium speed */}
            <div className="flex flex-col gap-4 animate-scroll-down-medium">
              {[...testimonials.slice(3), ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <Card key={`c2-${i}`} t={t} />
              ))}
            </div>

            {/* Column 3 - moves up fast */}
            <div className="flex flex-col gap-4 animate-scroll-up-fast">
              {[...testimonials.slice(6), ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <Card key={`c3-${i}`} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <div className="w-full rounded-2xl p-5 border border-zinc-200 hover:border-zinc-300 bg-white/90 backdrop-blur-sm transition-colors relative group shadow-sm">
      
      <div className="mb-4 flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full w-full bg-linear-to-br from-zinc-300 to-zinc-400" />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="truncate text-sm font-semibold">{t.name}</h3>
            {t.verified && (
              <svg className="h-4 w-4 shrink-0 text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.52 3.59c.8-.5 1.9-.5 2.68 0l1.9 1.2c.4.2.9.4 1.4.4h2.2c1 0 1.8.8 1.8 1.8v2.2c0 .5.1 1 .4 1.4l1.2 1.9c.5.8.5 1.9 0 2.68l-1.2 1.9c-.2.4-.4.9-.4 1.4v2.2c0 1-.8 1.8-1.8 1.8h-2.2c-.5 0-1 .1-1.4.4l-1.9 1.2c-.8.5-1.9.5-2.68 0l-1.9-1.2c-.4-.2-.9-.4-1.4-.4H4.8c-1 0-1.8-.8-1.8-1.8v-2.2c0-.5-.1-1-.4-1.4l-1.2-1.9c-.5-.8-.5-1.9 0-2.68l1.2-1.9c.2-.4.4-.9.4-1.4V4.8c0-1 .8-1.8 1.8-1.8h2.2c.5 0 1-.1 1.4-.4l1.9-1.2zM16.7 9.3c.4.4.4 1 0 1.4l-5 5c-.4.4-1 .4-1.4 0l-2-2c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.3 1.3 4.3-4.3c.4-.4 1-.4 1.4 0z" />
              </svg>
            )}
          </div>
          <p className="truncate text-sm text-zinc-500">{t.username}</p>
        </div>
      </div>
      
      <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700">{t.content}</p>
    </div>
  );
}