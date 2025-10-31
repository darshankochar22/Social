"use client";

import React, { useState } from "react";
import { Users, Search, TrendingUp, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavBar from "@/app/components/bottom-navbar";
import { FocusCards } from "@/components/ui/focus-cards";

export default function CommunitiesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const allCommunities = [
    {
      title: "Fashion & Style",
      src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/fashion",
    },
    {
      title: "Mental Wellness",
      src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/wellness",
    },
    {
      title: "Fitness & Health",
      src: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/health",
    },
    {
      title: "Beauty & Skincare",
      src: "https://images.unsplash.com/photo-1612817159949-195b6eb9a1f0?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/beauty",
    },
    {
      title: "Travel & Adventure",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/travel",
    },
    {
      title: "Books & Reading",
      src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/books",
    },
    {
      title: "Tech & Innovation",
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/tech",
    },
    {
      title: "Cooking & Recipes",
      src: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/cooking",
    },
    {
      title: "Art & Creativity",
      src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/art",
    },
    {
      title: "Motherhood",
      src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1000&auto=format&fit=crop",
      path: "/communities/motherhood",
    },
  ];

  const filtered = allCommunities.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Communities</h1>
          </div>
          <p className="text-pink-50 text-base mb-4">
            Find your tribe, share your passion, grow together
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats Section - Fixed */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-pink-500">
              {allCommunities.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Communities</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-purple-500">150K+</div>
            <div className="text-sm text-gray-600 mt-1">Members</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-rose-500">2.5M+</div>
            <div className="text-sm text-gray-600 mt-1">Posts</div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-bold text-gray-800">
              {searchQuery ? "Search Results" : "All Communities"}
            </h2>
          </div>
         {/*  <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Tap to explore</span>
          </div> */}
        </div> 

        {/* FocusCards Grid */}
        <FocusCards
          cards={filtered.map((c) => ({
            title: c.title,
            src: c.src,
            onClick: () => router.push(c.path),
          }))}
        />

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl font-medium">No communities found</p>
            <p className="text-gray-400 text-base mt-2">Try a different search</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}