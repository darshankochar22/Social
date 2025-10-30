"use client";

import { useEffect, useMemo, useState } from 'react';

type CommentDoc = {
  _id: string;
  targetType: 'post' | 'reel';
  targetId: string;
  accountId: string;
  text: string;
  createdAt?: string | number | Date;
};

type AccountDoc = {
  _id: string;
  username: string;
  avatarUrl?: string | null;
};

type ProfileDoc = {
  accountId: string;
  avatarUrl?: string | null;
  displayName?: string | null;
};

function formatTime(value?: string | number | Date): string {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : d.toLocaleString();
}

export default function Comments({ targetType, targetId, onCountChange }: { targetType: 'post' | 'reel'; targetId: string | number; onCountChange?: (count: number) => void }) {
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [viewer, setViewer] = useState<AccountDoc | null>(null);
  const stringTargetId = String(targetId);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/comments?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(stringTargetId)}`, { cache: 'no-store' });
        if (!cancelled && res.ok) {
          const rows: CommentDoc[] = await res.json();
          setComments(rows);
          onCountChange?.(rows.length);
        }
      } catch (e) {
        if (!cancelled) setError('Failed to load comments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [targetType, stringTargetId]);

  const accountIds = useMemo(() => Array.from(new Set(comments.map(c => c.accountId))), [comments]);
  const [accounts, setAccounts] = useState<Record<string, AccountDoc>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, AccountDoc> = {};
      await Promise.all(accountIds.map(async (id) => {
        try {
          const [accRes, profRes] = await Promise.all([
            fetch(`/api/account/${encodeURIComponent(id)}`, { cache: 'no-store' }),
            fetch(`/api/profiles?accountId=${encodeURIComponent(id)}`, { cache: 'no-store' })
          ]);
          let acc: AccountDoc | null = null;
          if (accRes.ok) acc = await accRes.json();
          let avatarFromProfile: string | null | undefined;
          if (profRes.ok) {
            const arr: ProfileDoc[] = await profRes.json();
            avatarFromProfile = (arr?.[0]?.avatarUrl) || null;
          }
          if (acc) {
            next[id] = { ...acc, avatarUrl: avatarFromProfile ?? acc.avatarUrl ?? null } as AccountDoc;
          }
        } catch {}
      }));
      if (!cancelled) setAccounts(next);
    })();
    return () => { cancelled = true; };
  }, [accountIds]);

  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
        if (meRes.ok) {
          const me = await meRes.json();
          const id = me?.account?._id as string | undefined;
          if (id) {
            const [accRes, profRes] = await Promise.all([
              fetch(`/api/account/${encodeURIComponent(id)}`, { cache: 'no-store' }),
              fetch(`/api/profiles?accountId=${encodeURIComponent(id)}`, { cache: 'no-store' })
            ]);
            let acc: AccountDoc | null = null;
            if (accRes.ok) acc = await accRes.json();
            let avatarFromProfile: string | null | undefined;
            if (profRes.ok) {
              const arr: ProfileDoc[] = await profRes.json();
              avatarFromProfile = (arr?.[0]?.avatarUrl) || null;
            }
            if (acc) setViewer({ ...acc, avatarUrl: avatarFromProfile ?? acc.avatarUrl ?? null });
          }
        }
      } catch {}
    })();
  }, []);

  const addComment = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (posting) return;
    setPosting(true);
    try {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
      const me = meRes.ok ? await meRes.json() : null;
      const accountId = me?.account?._id;
      const body = { targetType, targetId: stringTargetId, text: trimmed, ...(accountId ? { accountId } : {}) };
      const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (res.ok) {
        const saved: CommentDoc = await res.json();
        setComments(curr => [saved, ...curr]);
        if (saved.accountId && viewer) {
          setAccounts(curr => ({ ...curr, [saved.accountId]: viewer }));
        }
        setText('');
          onCountChange?.(comments.length + 1);
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-200">
          {viewer?.avatarUrl ? <img src={viewer.avatarUrl || ''} alt="me" className="h-8 w-8 object-cover" /> : null}
        </div>
        <div className="flex-1 flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 focus-within:ring-2 focus-within:ring-violet-300">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent text-sm outline-none"
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
                e.preventDefault();
                addComment();
              }
            }}
          />
          <button onClick={addComment} disabled={posting || !text.trim()} className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-white disabled:opacity-60">Post</button>
        </div>
      </div>
      {loading && <div className="text-xs text-zinc-500">Loading comments...</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
      {!loading && comments.length === 0 && <div className="text-xs text-zinc-500">No comments yet.</div>}
      <ul className="space-y-2">
        {comments.map(c => {
          const acc = accounts[c.accountId];
          const username = acc?.username ? `@${acc.username}` : '@user';
          const avatarUrl = acc?.avatarUrl || null;
          return (
            <li key={c._id} className="flex items-start gap-2">
              <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-zinc-200">
                {avatarUrl ? <img src={avatarUrl} alt={username} className="h-7 w-7 object-cover" /> : null}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900">{username}</span>
                  <span className="text-[11px] text-zinc-500">{formatTime(c.createdAt)}</span>
                </div>
                <div className="text-sm text-zinc-800 whitespace-pre-wrap">{c.text}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


