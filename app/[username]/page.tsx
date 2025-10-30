import { redirect, notFound } from 'next/navigation';

export default async function UsernameShortcut({ params }: { params: { username: string } }) {
  const username = params.username;
  // Avoid conflicting with known top-level routes
  const reserved = new Set(["home","discover","post","reel","profile","account","login","register","api","u"]);
  if (reserved.has(username)) {
    notFound();
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/accounts/lookup?username=${encodeURIComponent(username)}`, { cache: 'no-store' });
    if (res.ok) {
      redirect(`/u/${encodeURIComponent(username)}`);
    }
  } catch {}
  notFound();
}
