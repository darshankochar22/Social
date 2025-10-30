"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";

export default function CreatePostPage() {
	const [content, setContent] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [createdId, setCreatedId] = useState<string | null>(null);
	const [me, setMe] = useState<{ _id?: string; username?: string } | null>(null);

	useEffect(() => {
		(async () => {
			const res = await fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json()).catch(() => null);
			setMe(res?.account || null);
		})();
	}, []);

	const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		if (!file) return;
		setImageFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	const uploadImage = async (file: File) => {
		const form = new FormData();
		form.append('file', file);
		const res = await fetch('/api/upload', { method: 'POST', body: form });
		const j = await res.json();
		if (j?.url) return j.url;
		throw new Error(j?.error || 'Upload failed');
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim() && !imageFile) { setMessage('Write something or add an image'); return; }
		setLoading(true);
		setMessage("");
		setCreatedId(null);
		let finalImageUrl: string | undefined = undefined;
		try {
			if (imageFile) finalImageUrl = await uploadImage(imageFile);
			const body: any = { content, imageUrl: finalImageUrl };
			const res = await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
			const j = await res.json().catch(() => ({}));
			setMessage(res.ok ? "Posted" : (j?.error ? JSON.stringify(j.error) : "Failed to post"));
			if (res.ok && j?._id) setCreatedId(String(j._id));
			if (res.ok) { setContent(""); setPreviewUrl(""); setImageFile(null); }
		} catch (err: any) {
			setMessage('Failed to post: ' + (err.message || err));
		} finally { setLoading(false); }
	};

	return (
		<div className="mx-auto max-w-xl p-4">
			<div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
				<div className="mb-3 flex items-start gap-3">
					<div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500" />
					<div className="flex-1">
						<div className="flex items-center gap-2 text-sm text-zinc-600">{me?.username ? `@${me.username}` : 'New Post'}</div>
						<form onSubmit={onSubmit} className="mt-2 space-y-3">
							<textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" className="w-full rounded-md border px-3 py-2" rows={3} />
							{previewUrl && <img src={previewUrl} alt="preview" className="rounded-xl w-full max-h-80 object-cover" />}
							<div className="flex items-center gap-3">
								<label className="cursor-pointer rounded-md border px-3 py-1 text-sm">
									<input type="file" accept="image/*" className="hidden" onChange={handleFile} />
									Add image
								</label>
								<button disabled={loading} className="rounded-md bg-black px-4 py-1.5 text-sm text-white disabled:opacity-60">Post</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{message && (
				<p className="mt-3 text-sm text-zinc-700">{message} {createdId && <Link className="text-blue-600 underline" href={`/post/${createdId}`}>View post</Link>}</p>
			)}
		</div>
	);
}
