import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Link as LinkIcon, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PostCard, { type Post } from '@/app/components/post-card';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [meId, setMeId] = useState<string | null>(null);
  const [counts, setCounts] = useState<{followers:number; following:number}>({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followBusy, setFollowBusy] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const me = await fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json()).catch(() => null);
      if (!me?.account?._id) { router.push('/login'); return; }
      setMeId(me.account._id);
      // Load profile
      const pr = await fetch('/api/profiles?accountId=' + encodeURIComponent(me.account._id), { cache: 'no-store' }).then(r => r.json()).catch(() => []);
      const p = pr?.[0] || null;
      setProfile(p);
      // Load posts
      const ps = await fetch('/api/posts?accountId=' + encodeURIComponent(me.account._id), { cache: 'no-store' }).then(r => r.json()).catch(() => []);
      setPosts((ps || []).map((x:any) => ({ id: String(x._id), content: x.content||x.title||'', image: x.imageUrl||null, images: x.imageUrl?[x.imageUrl]:[], likes:0, comments:0, timestamp: x.createdAt ? new Date(x.createdAt).toLocaleString() : '' })));
      // Load follow stats
      const stats = await fetch('/api/follow/stats?accountId=' + encodeURIComponent(me.account._id), { cache: 'no-store' }).then(r => r.json()).catch(() => ({ followers:0, following:0 }));
      setCounts({ followers: stats.followers||0, following: stats.following||0 });
      // Check isFollowing (self will be false, button hidden anyway)
      const check = await fetch('/api/follow?count=1&followeeId=' + encodeURIComponent(me.account._id), { cache: 'no-store' }).then(r => r.json()).catch(() => ({ count:0 }));
      // If endpoint used without followerId, count is for all followers; for self-view, we hide button anyway
      setIsFollowing(false);
      setLoading(false);
    })();
  }, [router]);

  const doFollow = async () => {
    if (!profile || !meId || profile.accountId === meId) return;
    if (followBusy) return;
    setFollowBusy(true);
    try {
      const res = await fetch('/api/follow', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ followeeId: profile.accountId }) });
      if (res.ok) {
        setIsFollowing(true);
        setCounts(c => ({ ...c, followers: c.followers + 1 }));
      }
    } finally { setFollowBusy(false); }
  };

  const doUnfollow = async () => {
    if (!profile || !meId || profile.accountId === meId) return;
    if (followBusy) return;
    setFollowBusy(true);
    try {
      const res = await fetch('/api/follow?followeeId=' + encodeURIComponent(profile.accountId), { method: 'DELETE' });
      if (res.ok) {
        setIsFollowing(false);
        setCounts(c => ({ ...c, followers: Math.max(0, c.followers - 1) }));
      }
    } finally { setFollowBusy(false); }
  };

  if (loading) return <div className="p-12">Loading profile...</div>;
  if (!profile) return <div className="p-12 text-red-500">No profile found.</div>;

  const isSelf = meId && profile?.accountId === meId;

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
            <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-900">{profile.displayName || ''}<Sparkles className="h-5 w-5 text-amber-500" /></h2>
            <p className="text-zinc-600">@{profile.accountId}</p>
          </div>
          <div className="ml-auto mb-2 flex gap-3">
            {profile._id && (
              <Link href="/profile/edit" className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-zinc-300 text-zinc-800">Edit Profile</Link>
            )}
            {!isSelf && (
              isFollowing ? (
                <button onClick={doUnfollow} disabled={followBusy} className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-zinc-300 text-zinc-800">Following</button>
              ) : (
                <button onClick={doFollow} disabled={followBusy} className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-zinc-300 text-zinc-800">Follow</button>
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
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur">
              <div className="space-y-6 p-6">
                {posts.length === 0 && <p className='text-zinc-600'>You have no posts yet. Create one from the navbar.</p>}
                {posts.map((post) => {
                  const imagesParam = post.images?.join(',') || post.image || '';
                  return (
                    <div key={post.id} className="relative cursor-pointer">
                      <PostCard post={post} />
                      <div className="absolute inset-0" aria-label="Open post">
                        <Link
                          href={`/post?id=${encodeURIComponent(String(post.id))}&content=${encodeURIComponent(post.content)}&images=${encodeURIComponent(imagesParam)}&likes=${post.likes}&commentCount=${post.comments}&time=${encodeURIComponent(post.timestamp)}`}
                          className="absolute inset-0"
                        />
                      </div>
                      <div className="mt-2 flex gap-3">
                        <Link href={`/post/edit?id=${encodeURIComponent(String(post.id))}`} className="text-sm text-blue-600 hover:underline">Edit</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        </main>
      </section>
    </div>
  );
}