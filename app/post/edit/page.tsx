"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function EditPostPage() {
	const sp = useSearchParams();
	const id = sp.get('id');
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	useEffect(() => {
		(async () => {
			if (!id) { setLoading(false); return; }
			const r = await fetch('/api/posts/' + id, { cache: 'no-store' });
			if (r.ok) {
				const p = await r.json();
				setTitle(p.title || "");
				setContent(p.content || "");
				setImageUrl(p.imageUrl || "");
			}
			setLoading(false);
		})();
	}, [id]);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		setMessage("");
		const res = await fetch('/api/posts/' + id, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, content, imageUrl: imageUrl || null })
		});
		setMessage(res.ok ? 'Post updated' : 'Update failed');
		if (res.ok) { router.push('/profile'); router.refresh(); }
	};

	if (loading) return <div className="p-6">Loading...</div>;
	if (!id) return <div className="p-6">Missing post id</div>;

	return (
		<div className="mx-auto max-w-xl p-6">
			<h1 className="mb-4 text-xl font-semibold">Edit post</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded border px-3 py-2" />
				<textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" className="w-full rounded border px-3 py-2" />
				<input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="w-full rounded border px-3 py-2" />
				<button className="rounded bg-black px-4 py-2 text-white">Save</button>
			</form>
			{message && <p className="mt-3 text-sm text-zinc-700">{message}</p>}
		</div>
	);
}
