"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const body: any = { password };
			if (identifier.includes("@")) body.email = identifier; else body.username = identifier;
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				setError(j?.error || "Login failed");
				return;
			}
			router.push("/profile");
			router.refresh();
		} finally { setLoading(false); }
	};

	return (
		<div className="mx-auto max-w-sm p-6">
			<h1 className="mb-4 text-xl font-semibold">Login</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Username or Email" className="w-full rounded border px-3 py-2" />
				<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded border px-3 py-2" />
				<button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">Login</button>
			</form>
			{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
			<p className="mt-4 text-sm text-zinc-600">No account? <a className="text-blue-600 hover:underline" href="/register">Register</a>.</p>
		</div>
	);
}
