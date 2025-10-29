import Reel from '@/app/components/reel';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

type ReelViewProps = {
  src: string;
  title?: string;
  category?: string;
  comments?: { id: number; author: string; handle: string; text: string; time: string }[];
};

export default function ReelView({ src, title = '', category = 'Reel' }: ReelViewProps) {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center py-12">
      <div className="relative mx-auto w-full max-w-[34rem]">
        <Reel src={src} title={title} category={category} />
        {/* right action bar */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 space-y-4 text-white">
          <button className="flex flex-col items-center text-white/90 hover:text-white"><Heart className="h-6 w-6" /><span className="text-xs">9.4k</span></button>
          <button className="flex flex-col items-center text-white/90 hover:text-white"><MessageCircle className="h-6 w-6" /><span className="text-xs">1.1k</span></button>
          <button className="flex flex-col items-center text-white/90 hover:text-white"><Send className="h-6 w-6" /><span className="text-xs">Share</span></button>
          <button className="flex flex-col items-center text-white/90 hover:text-white"><Bookmark className="h-6 w-6" /><span className="text-xs">Save</span></button>
        </div>
        {/* bottom caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
          <p className="max-w-[22rem] text-sm font-medium text-white">{title || 'Reel title or caption goes here'}</p>
        </div>
      </div>
    </div>
  );
}


