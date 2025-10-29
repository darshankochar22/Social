import { Heart, MessageCircle, Share2 } from 'lucide-react';

export type Post = {
  id: number;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  timestamp: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
      <header className="mb-3 flex items-start gap-3">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-linear-to-br from-purple-500 to-pink-500" />
        <div className="flex-1">
          <div className="flex items-center gap-2"><span className="font-semibold text-gray-900">Sarah Anderson</span><span className="text-sm text-gray-500">{post.timestamp}</span></div>
          <p className="mt-2 text-gray-700">{post.content}</p>
          {post.image && (<img src={post.image} alt="Post" className="mt-3 max-h-96 w-full rounded-xl object-cover" />)}
        </div>
      </header>
      <footer className="mt-4 flex items-center justify-center gap-8 md:justify-end">
        <button className="flex items-center gap-2 text-gray-600 transition hover:text-pink-600">
          <Heart className="h-5 w-5" />
          <span className="text-sm font-medium">{post.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 transition hover:text-blue-600">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 transition hover:text-green-600">
          <Share2 className="h-5 w-5" />
        </button>
      </footer>
    </article>
  );
}


