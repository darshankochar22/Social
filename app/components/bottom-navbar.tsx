import React, { useState } from 'react';
import { Home, Search, Users, Bell, User, Play } from 'lucide-react';

export default function BottomNavBar() {
  const [activeTab, setActiveTab] = useState('home');
  const [notificationCount] = useState(3);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'communities', icon: Users, label: 'Communities' },
    { id: 'reels', icon: Play, label: 'Reels' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: notificationCount },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-red-400 bg-clip-text text-transparent mb-2">
            Welcome to Your Feed
          </h1>
          <p className="text-gray-600">Connect with communities that matter to you</p>
        </div>

        {/* Sample Feed Posts */}
        <div className="space-y-4">
          {[1, 2, 3].map((post) => (
            <div key={post} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500"></div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">@username</p>
                    <p className="text-xs text-gray-500">2h ago</p>
                  </div>
                </div>
                <p className="text-gray-800 mb-3">
                  Sample post content about fashion, health, or mental wellness...
                </p>
                <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl"></div>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 flex gap-6 text-gray-600">
                <button className="flex items-center gap-2 text-sm hover:text-pink-500 transition">
                  <span>❤️</span> <span>234</span>
                </button>
                <button className="flex items-center gap-2 text-sm hover:text-pink-500 transition">
                  <span>💬</span> <span>45</span>
                </button>
                <button className="flex items-center gap-2 text-sm hover:text-pink-500 transition">
                  <span>🔖</span> <span>Save</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="relative flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] group"
                >
                  {/* Icon Container */}
                  <div className="relative">
                    <div className={`
                      p-2 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-200' 
                        : 'bg-transparent group-hover:bg-pink-50'
                      }
                    `}>
                      <Icon 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-gray-600 group-hover:text-pink-500'
                        }`}
                        strokeWidth={2.5}
                      />
                    </div>
                    
                    {/* Notification Badge */}
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                        {item.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`
                    text-[11px] font-medium transition-all duration-300
                    ${isActive 
                      ? 'text-pink-500 scale-105' 
                      : 'text-gray-600 group-hover:text-pink-500'
                    }
                  `}>
                    {item.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

