import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

type Post = {
  id: string;
  author: string;
  handle: string;
  verified?: boolean;
  avatar: string;
  images: string[];
  caption: string;
  hashtags: string[];
  likes: number;
  timeAgo: string;
};

type Comment = {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
};

export default function PostView({ 
  post, 
  comments = [] 
}: { 
  post: Post; 
  comments?: Comment[] 
}) {
  return (
    <div className="min-h-screen w-full bg-white p-100 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Post Section */}
          <div className="md:col-span-7 lg:col-span-8 flex items-start justify-center bg-black">
            <div className="w-full aspect-square flex items-center justify-center relative">
              <Image 
                src={post.images[0]} 
                alt="Post content"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-5 lg:col-span-4 bg-white border-l border-zinc-200 flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <Image 
                  src={post.avatar} 
                  alt={post.author}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-zinc-900">{post.handle}</span>
                  {post.verified && (
                    <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  )}
                  <span className="text-sm text-zinc-500 ml-2">• Follow</span>
                </div>
              </div>
              <button className="text-zinc-900">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            {/* Comments Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Original Caption */}
              <div className="flex gap-3">
                <Image 
                  src={post.avatar} 
                  alt={post.author}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-zinc-900">{post.handle}</span>
                    <span className="text-xs text-zinc-400">{post.timeAgo}</span>
                  </div>
                  <p className="text-sm text-zinc-900 mt-1">
                    {post.caption}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.hashtags.map((tag, i) => (
                      <span key={i} className="text-sm text-blue-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments */}
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Image 
                    src={comment.avatar} 
                    alt={comment.author}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-zinc-900">{comment.author}</span>
                      <span className="text-xs text-zinc-400">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-zinc-900 mt-1">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Footer */}
            <div className="border-t border-zinc-200">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <button className="hover:opacity-60 transition">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="hover:opacity-60 transition">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button className="hover:opacity-60 transition">
                    <Send className="w-6 h-6" />
                  </button>
                </div>
                <button className="hover:opacity-60 transition">
                  <Bookmark className="w-6 h-6" />
                </button>
              </div>
              
              <div className="px-3 pb-2">
                <p className="text-sm font-semibold text-zinc-900">{post.likes.toLocaleString()} likes</p>
              </div>

              {/* Add Comment */}
              <div className="flex items-center gap-3 p-3 border-t border-zinc-200">
                <input 
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 text-sm outline-none"
                />
                <button className="text-sm font-semibold text-blue-500 hover:text-blue-600">
                  Post
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}