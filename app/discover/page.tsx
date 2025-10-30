"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SearchResult = { accountId: string; username?: string; displayName?: string | null; avatarUrl?: string | null };

export default function Discover() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) { setResults([]); return; }
      setLoading(true);
      try {
        const r = await fetch('/api/accounts/search?q=' + encodeURIComponent(q.trim()), { cache: 'no-store' });
        const j = await r.json();
        setResults(Array.isArray(j.results) ? j.results : []);
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-xl font-semibold">Discover people</h1>
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setTouched(true); }}
        placeholder="Search by username or name"
        className="w-full rounded border px-3 py-2"
      />
      {loading && <p className="mt-3 text-sm text-zinc-600">Searching...</p>}
      {!loading && touched && results.length === 0 && q.trim() && (
        <p className="mt-3 text-sm text-zinc-600">No users found.</p>
      )}

      <div className="mt-6 space-y-3">
        {results.map((r) => (
          <Link key={r.accountId} href={r.username ? `/u/${encodeURIComponent(r.username)}` : '#'} className="block rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-100">
                {r.avatarUrl ? <img src={r.avatarUrl} alt="avatar" className="h-full w-full object-cover" /> : null}
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900">{r.displayName || r.username}</div>
                <div className="text-xs text-zinc-500">@{r.username || r.accountId}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


