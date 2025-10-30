"use client";

import { useState } from "react";

export default function CreateReelPage() {
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [caption, setCaption] = useState("");
    const [durationSec, setDurationSec] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
        try {
            let finalUrl = videoUrl;
            if (file) {
                const form = new FormData();
                form.append("file", file);
                const up = await fetch("/api/upload", { method: "POST", body: form });
                if (!up.ok) throw new Error("Upload failed");
                const j = await up.json();
                finalUrl = j.url;
            }

            const meRes = await fetch('/api/auth/me', { cache: 'no-store' }).catch(() => null as any);
            const me = meRes && meRes.ok ? await meRes.json() : null;
            const accountId = me?.account?._id || 'demo-account';

            const res = await fetch("/api/reels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId, videoUrl: finalUrl, caption: caption || undefined, durationSec })
            });
            setMessage(res.ok ? "Reel created" : "Failed to create reel");
            if (res.ok) { setFile(null); setVideoUrl(""); setCaption(""); setDurationSec(0); }
        } finally { setLoading(false); }
	};

	return (
        <div className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-xl font-semibold">Create reel</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="rounded-2xl border border-zinc-200 bg-white/90 p-4">
                    <label className="block text-sm font-medium text-zinc-800 mb-2">Upload video</label>
                    <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
                    <div className="my-2 text-xs text-zinc-500">or paste a video URL</div>
                    <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="w-full rounded-md border px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-zinc-800 mb-1">Duration (sec)</label>
                        <input value={durationSec} onChange={(e) => setDurationSec(Number(e.target.value) || 0)} placeholder="0" type="number" className="w-full rounded-md border px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-800 mb-1">Caption</label>
                        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional" className="w-full rounded-md border px-3 py-2 text-sm" />
                    </div>
                </div>
                <button disabled={loading} className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60">Create</button>
            </form>
            {message && <p className="mt-3 text-sm text-zinc-700">{message}</p>}
        </div>
	);
}
