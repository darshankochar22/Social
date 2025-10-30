"use client";

import { useState } from "react";

export default function CreatePostPage() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			const res = await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ accountId: "demo-account", title, content, imageUrl: imageUrl || undefined })
			});
			setMessage(res.ok ? "Post created" : "Failed to create post");
			if (res.ok) { setTitle(""); setContent(""); setImageUrl(""); }
		} finally { setLoading(false); }
	};

	return (
		<div className="mx-auto max-w-md p-6">
			<h1 className="mb-4 text-xl font-semibold">Create post</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded border px-3 py-2" />
				<textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" className="w-full rounded border px-3 py-2" />
				<input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="w-full rounded border px-3 py-2" />
				<button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">Create</button>
			</form>
			{message && <p className="mt-3 text-sm text-zinc-700">{message}</p>}
		</div>
	);
}
