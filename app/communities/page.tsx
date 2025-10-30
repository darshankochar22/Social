"use client";

import React, { useState } from "react";
import { Search, TrendingUp, Sparkles, X } from "lucide-react";
import { FocusCards } from "@/components/ui/focus-cards";
import { useRouter } from "next/navigation"; 
import BottomNavBar from "@/app/components/bottom-navbar"; 

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"all" | "popular" | "new">("all");

  const router = useRouter(); 

  
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

  // Filter based on search
  const filtered = allCommunities.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 pb-20">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">Communities</h1>
              <p className="text-pink-50 text-sm">Find your tribe ✨</p>
            </div>

            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-xl bg-white/20 backdrop-blur-sm active:bg-white/30 transition-all"
            >
              {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          </div>

          {/* Search Input */}
          {showSearch && (
            <div className="mb-4 animate-in slide-in-from-top duration-300">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all ${
                filterCategory === "all"
                  ? "bg-white text-pink-500 shadow-md"
                  : "bg-white/20 text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory("popular")}
              className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all flex items-center gap-1.5 ${
                filterCategory === "popular"
                  ? "bg-white text-pink-500 shadow-md"
                  : "bg-white/20 text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Popular
            </button>
            <button
              onClick={() => setFilterCategory("new")}
              className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all flex items-center gap-1.5 ${
                filterCategory === "new"
                  ? "bg-white text-pink-500 shadow-md"
                  : "bg-white/20 text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              New
            </button>
          </div>
        </div>
      </div>

      {/* Focus Cards Section */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <FocusCards
          cards={filtered.map((c) => ({
            title: c.title,
            src: c.src,
            onClick: () => router.push(c.path), // 👈 navigate on click
          }))}
        />
      </div>
    </div>
   {/* Bottom Navigation */}
   <BottomNavBar />
    </div>
  );
}
