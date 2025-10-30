"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
	const [username, setUsername] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/auth/me", { cache: "no-store" });
				if (res.ok) {
					const j = await res.json();
					if (mounted) setUsername(j?.account?.username ?? null);
				}
			} finally { if (mounted) setLoading(false); }
		})();
		return () => { mounted = false; };
	}, []);

	const logout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		setUsername(null);
		if (typeof window !== 'undefined') window.location.reload();
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
				<Link href="/" className="font-semibold">HackCBS</Link>
				<nav className="flex items-center gap-4 text-sm text-zinc-700">
					<Link href="/">Home</Link>
					<Link href="/discover">Discover</Link>
					<Link href="/post/create">Post</Link>
					<Link href="/reel/create">Reel</Link>
					<Link href="/profile">Profile</Link>
					<span className="mx-2 h-4 w-px bg-zinc-300" />
					{loading ? (
						<span className="text-zinc-500">...</span>
					) : username ? (
						<div className="flex items-center gap-2">
							<span className="text-zinc-800">{username}</span>
							<button onClick={logout} className="rounded bg-black px-2 py-1 text-white">Logout</button>
						</div>
					) : (
						<Link href="/login" className="rounded bg-black px-3 py-1.5 text-white">Login</Link>
					)}
				</nav>
			</div>
		</header>
	);
}

