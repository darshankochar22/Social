"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Link as LinkIcon, Calendar, Sparkles } from "lucide-react";
import PostCard, { type Post } from "@/app/components/post-card";

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username || "";
  const router = useRouter();
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [account, setAccount] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [counts, setCounts] = useState<{followers:number; following:number}>({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // who is viewing
      const me = await fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json()).catch(() => null);
      setViewerId(me?.account?._id || null);

      // lookup account by username
      const accRes = await fetch('/api/accounts/lookup?username=' + encodeURIComponent(String(username)), { cache: 'no-store' });
      if (!accRes.ok) { setLoading(false); return; }
      const acc = await accRes.json();
      setAccount(acc.account);

      // profile
      const pr = await fetch('/api/profiles?accountId=' + encodeURIComponent(acc.account._id), { cache: 'no-store' }).then(r => r.json());
      setProfile(pr?.[0] || null);

      // posts
      const ps = await fetch('/api/posts?accountId=' + encodeURIComponent(acc.account._id), { cache: 'no-store' }).then(r => r.json());
      setPosts((ps || []).map((x:any) => ({ id: String(x._id), content: x.content||x.title||'', image: x.imageUrl||null, images: x.imageUrl?[x.imageUrl]:[], likes:0, comments:0, timestamp: x.createdAt ? new Date(x.createdAt).toLocaleString() : '' })));

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
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur">
            <div className="space-y-6 p-6">
              {posts.length === 0 && <p className='text-zinc-600'>No posts yet.</p>}
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
