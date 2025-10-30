"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email, password })
			});
			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				setError(j?.error || "Registration failed");
				return;
			}
			router.push("/");
			router.refresh();
		} finally { setLoading(false); }
	};

	return (
		<div className="mx-auto max-w-sm p-6">
			<h1 className="mb-4 text-xl font-semibold">Register</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded border px-3 py-2" />
				<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full rounded border px-3 py-2" />
				<input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full rounded border px-3 py-2" />
				<button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">Create account</button>
			</form>
			{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
			<p className="mt-4 text-sm text-zinc-600">Already have an account? <a className="text-blue-600 hover:underline" href="/login">Login</a>.</p>
		</div>
	);
}
