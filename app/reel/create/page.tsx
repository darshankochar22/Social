"use client";

import { useState } from "react";

export default function CreateReelPage() {
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
			const res = await fetch("/api/reels", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ accountId: "demo-account", videoUrl, caption: caption || undefined, durationSec })
			});
			setMessage(res.ok ? "Reel created" : "Failed to create reel");
			if (res.ok) { setVideoUrl(""); setCaption(""); setDurationSec(0); }
		} finally { setLoading(false); }
	};

	return (
		<div className="mx-auto max-w-md p-6">
			<h1 className="mb-4 text-xl font-semibold">Create reel</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL" className="w-full rounded border px-3 py-2" />
				<input value={durationSec} onChange={(e) => setDurationSec(Number(e.target.value) || 0)} placeholder="Duration (sec)" type="number" className="w-full rounded border px-3 py-2" />
				<textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="w-full rounded border px-3 py-2" />
				<button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">Create</button>
			</form>
			{message && <p className="mt-3 text-sm text-zinc-700">{message}</p>}
		</div>
	);
}
