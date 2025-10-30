"use client";

import React from "react";
import { Home, Search, Users, Bell, User, Play } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const notificationCount = 3;

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/home" },
    { id: "search", icon: Search, label: "Search", path: "/discover" },
    { id: "communities", icon: Users, label: "Communities", path: "/communities" },
    { id: "reels", icon: Play, label: "Reels", path: "/reel" },
    { id: "notifications", icon: Bell, label: "Notifications", badge: notificationCount, path: "/notifications" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const onClickItem = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-2xl mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);

            return (
              <button
                key={item.id}
                onClick={() => onClickItem(item.path)}
                className="relative flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] group"
              >
                {/* Icon container */}
                <div className="relative">
                  <div
                    className={`
                      p-2 rounded-xl transition-all duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-200"
                          : "bg-transparent group-hover:bg-pink-50"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 group-hover:text-pink-500"
                      }`}
                      strokeWidth={2.5}
                    />
                  </div>

                  {item.badge && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {item.badge}
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-[11px] font-medium transition-all duration-300
                    ${
                      isActive
                        ? "text-pink-500 scale-105"
                        : "text-gray-600 group-hover:text-pink-500"
                    }
                  `}
                >
                  {item.label}
                </span>

                {/* Top indicator bar */}
                {isActive && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
