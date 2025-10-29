import React, { useState } from 'react';
import { Camera, MapPin, Link as LinkIcon, Calendar, MoreHorizontal, Users, Sparkles, Shield } from 'lucide-react';
import Link from 'next/link';
import PostCard, { type Post } from '@/app/components/post-card';
import Reel from '@/app/components/reel';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [following, setFollowing] = useState(false);

  const sampleImages = [
    'https://cdn-imgix.headout.com/tour/7064/TOUR-IMAGE/b2c74200-8da7-439a-95b6-9cad1aa18742-4445-dubai-img-worlds-of-adventure-tickets-02.jpeg?auto=format&w=1200&q=90&fit=clip',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
  ];

  const sampleContents = [
    "Just finished reading 'Atomic Habits' - life changing! 📚 What books have transformed your perspective lately?",
    "Morning yoga session complete ✨ Remember: self-care isn't selfish, it's essential!",
    "Excited to announce I'm starting my own design studio! Dreams do come true when you work for them 💪",
    "Coffee chat with a mentor today. Learned so much!",
    "Weekend getaway planning begins now.",
    "Wireframing a new idea — can't wait to share.",
    "Focus mode: on."
  ];

  const posts: Post[] = Array.from({ length: 25 }, (_, idx) => {
    const i = idx + 1;
    return {
      id: i,
      content: sampleContents[idx % sampleContents.length],
      image: sampleImages[idx % sampleImages.length],
      likes: Math.floor(120 + Math.random() * 1200),
      comments: Math.floor(10 + Math.random() * 300),
      timestamp: ['2h ago', '1d ago', '3d ago', '5h ago'][idx % 4]
    };
  });

  const circles = [
    { name: 'Book Club', members: 1234, color: 'bg-purple-500' },
    { name: 'Wellness Warriors', members: 892, color: 'bg-pink-500' },
    { name: 'Career Growth', members: 2341, color: 'bg-blue-500' },
    { name: 'Creative Corner', members: 567, color: 'bg-amber-500' }
  ];

  // Reels (short vertical videos)
  const reelSources = [
    'https://videos.pexels.com/video-files/857195/857195-uhd_2560_1440_25fps.mp4',
    'https://videos.pexels.com/video-files/854381/854381-hd_1920_1080_30fps.mp4',
    'https://videos.pexels.com/video-files/2790150/2790150-uhd_2560_1440_25fps.mp4',
    'https://videos.pexels.com/video-files/3064073/3064073-uhd_2560_1440_25fps.mp4',
    'https://videos.pexels.com/video-files/3129953/3129953-uhd_2560_1440_25fps.mp4',
    'https://videos.pexels.com/video-files/2795731/2795731-uhd_2560_1440_25fps.mp4',
    'https://videos.pexels.com/video-files/856933/856933-uhd_2560_1440_24fps.mp4',
    'https://videos.pexels.com/video-files/2795734/2795734-uhd_2560_1440_25fps.mp4'
  ];

  const reels: string[] = Array.from({ length: 25 }, (_, idx) => reelSources[idx % reelSources.length]);

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Hero + Avatar overlap */}
      <section className="relative mx-auto w-full max-w-4xl px-4">
        <div className="relative h-72 md:h-80 w-full overflow-hidden bg-zinc-200">
          <button className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 ring-1 ring-white/60 backdrop-blur hover:bg-white">
            <div className="flex items-center gap-2"><Camera className="h-4 w-4" /> Edit Cover</div>
          </button>
        </div>
        <div className="relative -mt-16 md:-mt-20 flex items-end gap-4 px-4">
          <div className="h-32 w-32 md:h-36 md:w-36 rounded-full border-[6px] border-white bg-white shadow-md">
            <div className="h-full w-full rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#d4d4d8,#a1a1aa,#d4d4d8)] p-[3px]">
              <div className="h-full w-full rounded-full bg-white" />
            </div>
          </div>
          <div className="mb-2">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-900">Sarah Anderson <Sparkles className="h-5 w-5 text-amber-500" /></h2>
            <p className="text-zinc-600">@sarah_anderson</p>
          </div>
          <div className="ml-auto mb-2 flex gap-3">
            <button
              onClick={() => setFollowing(!following)}
              className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${following ? 'bg-zinc-100 text-zinc-800 ring-zinc-300' : 'bg-zinc-900 text-white ring-zinc-900'}`}
            >{following ? 'Following' : 'Follow'}</button>
            <button className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-zinc-300 text-zinc-800">Message</button>
          </div>
        </div>
      </section>

      {/* Layout: info + tabs */}
      <section className="mx-auto mt-4 flex w-full max-w-4xl flex-col gap-6 px-4">
        {/* About + counts */}
        <aside className="w-full">
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="mb-4 text-zinc-700">UI/UX Designer | Book Lover | Wellness Advocate 🌸<br />Spreading positivity and empowering women to chase their dreams ✨</p>
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-zinc-600">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
              <span className="flex items-center gap-1"><LinkIcon className="h-4 w-4" /><a href="#" className="text-violet-600 hover:underline">sarahdesigns.com</a></span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined March 2024</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><div className="text-2xl font-bold text-zinc-900">1,234</div><div className="text-sm text-zinc-600">Posts</div></div>
              <div><div className="text-2xl font-bold text-zinc-900">12.5K</div><div className="text-sm text-zinc-600">Followers</div></div>
              <div><div className="text-2xl font-bold text-zinc-900">856</div><div className="text-sm text-zinc-600">Following</div></div>
            </div>
          </div>
        </aside>

        {/* Tabs + content */}
        <main className="w-full">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur">
            <div className="flex border-b border-zinc-200">
              {['posts', 'reels'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 font-medium capitalize transition ${activeTab === tab ? 'text-violet-700 border-b-2 border-violet-600' : 'text-zinc-600 hover:text-zinc-900'}`}
                >{tab}</button>
              ))}
            </div>

            {activeTab === 'posts' && (
              <div className="space-y-6 p-6">
                {posts.map((post) => (
                  <div key={post.id} className="relative cursor-pointer">
                    <PostCard post={post} />
                    <Link
                      href={`/post?id=${post.id}&content=${encodeURIComponent(post.content)}&image=${encodeURIComponent(post.image ?? '')}&likes=${post.likes}&commentCount=${post.comments}&time=${encodeURIComponent(post.timestamp)}`}
                      className="absolute inset-0"
                      aria-label="Open post"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reels' && (
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {reels.map((src, i) => (
                    <div key={i} className="relative cursor-pointer">
                      <Reel src={src} title="A day in the life" category="Reel" />
                      <Link
                        href={`/reel?src=${encodeURIComponent(src)}&title=${encodeURIComponent('A day in the life')}&category=Reel`}
                        className="absolute inset-0"
                        aria-label="Open reel"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </section>
    </div>
  );
}