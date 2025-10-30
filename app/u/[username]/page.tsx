"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Link as LinkIcon, Calendar, Sparkles } from "lucide-react";
import PostCard, { type Post } from "@/app/components/post-card";
import { Carousel, Card as AppleCard } from "@/components/ui/apple-cards-carousel";

type Account = { _id: string; username: string };
type Profile = {
  accountId: string;
  displayName?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  about?: string | null;
  location?: string | null;
  website?: string | null;
};
type DbPost = { _id: string; content?: string; title?: string; imageUrl?: string | null; createdAt?: string | number | Date };
type DbReel = { _id: string; accountId: string; videoUrl: string; thumbnailUrl?: string | null; caption?: string | null; createdAt?: string | number | Date };

function formatTimestamp(value: string | number | Date | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : d.toLocaleString();
}

function PublicReelsCarousel({ reels }: { reels: DbReel[] }) {
  const items = reels.map((reel, idx) => (
    <div key={String(reel._id)} className="relative">
      <AppleCard
        card={{
          src: reel.thumbnailUrl || '/vercel.svg',
          title: reel.caption || 'Reel',
          category: 'Reel',
          content: (
            <div className="relative">
              <video
                controls
                src={reel.videoUrl}
                className="h-full w-full rounded-xl bg-black"
              />
            </div>
          ),
        }}
        index={idx}
      />
      <a href={`/reel/${encodeURIComponent(String(reel._id))}`} className="absolute inset-0" aria-label="Open reel" />
    </div>
  ));
  return <Carousel items={items} />;
}

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username || "";
  const router = useRouter();
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [counts, setCounts] = useState<{followers:number; following:number}>({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState<DbReel[]>([]);
  const [activeTab, setActiveTab] = useState<'posts'|'reels'>('posts');

  useEffect(() => {
    (async () => {
      // who is viewing
      const me = await fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json()).catch(() => null);
      setViewerId(me?.account?._id || null);

      // lookup account by username
      const accRes = await fetch('/api/accounts/lookup?username=' + encodeURIComponent(String(username)), { cache: 'no-store' });
      if (!accRes.ok) { setLoading(false); return; }
      const acc = await accRes.json();
      setAccount(acc.account as Account);

      // profile
      const pr = await fetch('/api/profiles?accountId=' + encodeURIComponent(acc.account._id), { cache: 'no-store' }).then(r => r.json());
      setProfile((pr?.[0] as Profile) || null);

      // posts
      const ps = await fetch('/api/posts?accountId=' + encodeURIComponent(acc.account._id), { cache: 'no-store' }).then(r => r.json());
      setPosts((ps || []).map((x: DbPost) => ({ id: String(x._id), content: x.content||x.title||'', image: x.imageUrl||null, images: x.imageUrl?[x.imageUrl]:[], likes:0, comments:0, timestamp: formatTimestamp(x.createdAt) })));

      // reels
      const rs = await fetch('/api/reels?accountId=' + encodeURIComponent(acc.account._id), { cache: 'no-store' }).then(r => r.json()).catch(() => [] as DbReel[]);
      setReels(Array.isArray(rs) ? rs : []);

      // follow stats
      const stats = await fetch('/api/follow/stats?accountId=' + encodeURIComponent(acc.account._id), { cache: 'no-store' }).then(r => r.json()).catch(() => ({ followers:0, following:0 }));
      setCounts({ followers: stats.followers||0, following: stats.following||0 });

      // check if viewer follows this account
      if (me?.account?._id) {
        const chk = await fetch('/api/follow?count=1&followerId=' + encodeURIComponent(me.account._id) + '&followeeId=' + encodeURIComponent(acc.account._id), { cache: 'no-store' }).then(r => r.json()).catch(() => ({ count:0 }));
        setIsFollowing((chk?.count || 0) > 0);
      }

      setLoading(false);
    })();
  }, [username, router]);

  const doFollow = async () => {
    if (!account || !viewerId || viewerId === account._id) return;
    if (busy) return; setBusy(true);
    try {
      const res = await fetch('/api/follow', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ followeeId: account._id }) });
      if (res.ok) { setIsFollowing(true); setCounts(c => ({ ...c, followers: c.followers + 1 })); }
    } finally { setBusy(false); }
  };

  const deletePost = async (postId: string) => {
    if (!postId) return;
    if (!account || !viewerId || account._id !== viewerId) return;
    const ok = typeof window !== 'undefined' ? window.confirm('Delete this post?') : true;
    if (!ok) return;
    const res = await fetch('/api/posts/' + encodeURIComponent(postId), { method: 'DELETE' });
    if (res.ok) {
      setPosts(curr => curr.filter(p => String(p.id) !== String(postId)));
    }
  };

  const doUnfollow = async () => {
    if (!account || !viewerId || viewerId === account._id) return;
    if (busy) return; setBusy(true);
    try {
      const res = await fetch('/api/follow?followeeId=' + encodeURIComponent(account._id), { method: 'DELETE' });
      if (res.ok) { setIsFollowing(false); setCounts(c => ({ ...c, followers: Math.max(0, c.followers - 1) })); }
    } finally { setBusy(false); }
  };

  if (loading) return <div className="p-12">Loading...</div>;
  if (!account || !profile) return <div className="p-12">User not found.</div>;

  const isSelf = viewerId && account._id === viewerId;

  return (
    <div className="min-h-screen w-full bg-white">
      <section className="relative mx-auto w-full max-w-7xl px-4">
        <div className="relative h-72 md:h-80 w-full overflow-hidden bg-zinc-200">
          {profile.coverUrl ? (
            <img src={profile.coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          ) : null}
        </div>
        <div className="relative -mt-16 md:-mt-20 flex items-end gap-4 px-4">
          <div className="h-32 w-32 md:h-36 md:w-36 rounded-full border-[6px] border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover rounded-full" />
            ) : (
              <div className="h-full w-full rounded-full bg-zinc-100" />
            )}
          </div>
          <div className="mb-2">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-900">{profile.displayName || account.username}<Sparkles className="h-5 w-5 text-amber-500" /></h2>
            <p className="text-zinc-600">@{account.username}</p>
          </div>
          <div className="ml-auto mb-2 flex gap-3">
            {!isSelf && (
              isFollowing ? (
                <button onClick={doUnfollow} disabled={busy} className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-zinc-300 text-zinc-800">Following</button>
              ) : (
                <button onClick={doFollow} disabled={busy} className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-zinc-300 text-zinc-800">Follow</button>
              )
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-4 flex w-full max-w-7xl flex-col gap-6 px-4">
        <aside className="w-full">
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="mb-2 text-zinc-700 whitespace-pre-line min-h-[2em]">{profile.about}</div>
            <div className="mb-6 flex flex-wrap gap-4 text-sm text-zinc-600">
              {profile.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile.location}</span>}
              {profile.website && <span className="flex items-center gap-1"><LinkIcon className="h-4 w-4" /><a href={profile.website} target="_blank" className="text-violet-600 hover:underline">{profile.website}</a></span>}
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /></span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><div className="text-2xl font-bold text-zinc-900">{posts.length}</div><div className="text-sm text-zinc-600">Posts</div></div>
              <div><div className="text-2xl font-bold text-zinc-900">{counts.followers}</div><div className="text-sm text-zinc-600">Followers</div></div>
              <div><div className="text-2xl font-bold text-zinc-900">{counts.following}</div><div className="text-sm text-zinc-600">Following</div></div>
            </div>
          </div>
        </aside>

        <main className="w-full">
          <div className="mb-4 flex items-center gap-2">
            <button onClick={() => setActiveTab('posts')} className={`rounded-full px-4 py-2 text-sm font-medium ring-1 ring-zinc-300 ${activeTab==='posts' ? 'bg-zinc-900 text-white' : 'text-zinc-800'}`}>Posts</button>
            <button onClick={() => setActiveTab('reels')} className={`rounded-full px-4 py-2 text-sm font-medium ring-1 ring-zinc-300 ${activeTab==='reels' ? 'bg-zinc-900 text-white' : 'text-zinc-800'}`}>Reels</button>
          </div>

          {activeTab==='reels' && (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur">
              <div className="px-2 py-4">
                {reels.length === 0 ? (
                  <p className="px-4 text-zinc-600">No reels yet.</p>
                ) : (
                  <PublicReelsCarousel reels={reels} />
                )}
              </div>
            </div>
          )}

          {activeTab==='posts' && (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur">
            <div className="space-y-6 p-6">
              {posts.length === 0 && <p className='text-zinc-600'>No posts yet.</p>}
              {posts.map((post) => {
                return (
                  <div key={post.id} className="relative cursor-pointer">
                    <PostCard 
                      post={post} 
                      authorName={(profile?.displayName || account!.username)}
                      authorUsername={account!.username}
                      authorAvatarUrl={(profile?.avatarUrl || null)}
                      canDelete={!!isSelf}
                      onDelete={() => deletePost(String(post.id))}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </main>
      </section>
    </div>
  );
}
