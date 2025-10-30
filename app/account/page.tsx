"use client";

import { useState } from "react";

export default function AccountCreatePage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			const res = await fetch("/api/account", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email })
			});
			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				setMessage(j?.error ? JSON.stringify(j.error) : "Failed to create account");
			} else {
				setMessage("Account created");
				setUsername("");
				setEmail("");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-md p-6">
			<h1 className="mb-4 text-xl font-semibold">Create account</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded border px-3 py-2" />
				<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full rounded border px-3 py-2" />
				<button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">Create</button>
			</form>
			{message && <p className="mt-3 text-sm text-zinc-700">{message}</p>}
		</div>
	);
}
