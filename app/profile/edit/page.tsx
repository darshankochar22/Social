"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

function SocialLinksInput({value, onChange}: {value: {platform: string; url: string;}[], onChange: (v: {platform:string, url:string;}[]) => void}) {
  const addLink = () => onChange([...value, { platform: '', url: '' }]);
  const removeLink = (i: number) => onChange(value.filter((_, idx) => idx!==i));
  const updateLink = (i: number, field: string, val: string) => onChange(value.map((link, idx) => idx !== i ? link : { ...link, [field]: val }));
  return <div className="space-y-2">
    {value.map((link, i) => (
      <div key={i} className="flex gap-2">
        <input value={link.platform} onChange={e=>updateLink(i,'platform',e.target.value)} placeholder="Platform (eg. Twitter)" className="flex-1 rounded border px-2 py-1"/>
        <input value={link.url} onChange={e=>updateLink(i,'url',e.target.value)} placeholder="Profile URL" className="flex-1 rounded border px-2 py-1"/>
        <button type="button" onClick={()=>removeLink(i)} className="px-2 rounded bg-zinc-200">✗</button>
      </div>
    ))}
    <button type="button" onClick={addLink} className="rounded bg-zinc-900 text-white px-3 py-1">Add link</button>
  </div>;
}

function isValidUrlOrEmpty(s: string) {
  if (!s) return true;
  try { new URL(s); return true; } catch { return false; }
}

export default function EditProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<{platform:string; url:string;}[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const me = await fetch('/api/auth/me', { cache: 'no-store' }).then(r => r.json());
      if (!me?.account?._id) { router.push('/login'); return; }
      const r = await fetch('/api/profiles?accountId=' + encodeURIComponent(me.account._id), { cache: 'no-store' });
      const profiles = await r.json();
      const p = profiles?.[0];
      if (p) {
        setProfileId(p._id);
        setDisplayName(p.displayName || "");
        setLocation(p.location || "");
        setWebsite(p.website || "");
        setAbout(p.about || "");
        setAvatarUrl(p.avatarUrl || "");
        setCoverUrl(p.coverUrl || "");
        setSocialLinks(Array.isArray(p.socialLinks) ? p.socialLinks : []);
      }
      setLoading(false);
    })();
  }, [router]);

  // Use file inputs to preview and "upload" (for now, we generate an objectURL, not real upload)
  const handleAvatarFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url); // Simulate upload
    // For real apps, upload file here and set the secure uploaded URL.
  };
  const handleCoverFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverUrl(url); // Simulate upload
    // For real apps, upload file here and set the secure uploaded URL.
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");
    if (!profileId) return;
    // Client-side validation for required fields and basic schema
    if (!displayName.trim()) { setFieldError("Display Name is required."); return; }
    if (displayName.length < 1 || displayName.length > 64) { setFieldError("Display Name must be 1-64 chars."); return; }
    if (!isValidUrlOrEmpty(avatarUrl)) { setFieldError("Profile photo URL must be valid or blank."); return; }
    if (!isValidUrlOrEmpty(coverUrl)) { setFieldError("Cover photo URL must be valid or blank."); return; }
    if (!isValidUrlOrEmpty(website)) { setFieldError("Website must be a valid URL or blank."); return; }
    for (const l of socialLinks) { if (!isValidUrlOrEmpty(l.url)) { setFieldError("Each social link must have a valid URL."); return; } }
    setMessage("");
    // Send real content only
    const body = {
      displayName: displayName,
      location: location || null,
      website: website || null,
      about: about || null,
      avatarUrl: avatarUrl || null,
      coverUrl: coverUrl || null,
      socialLinks,
    };
    try {
      const res = await fetch('/api/profiles/' + profileId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (!res.ok) {
        setMessage(result?.error ? JSON.stringify(result.error) : 'Update failed');
        return;
      }
      setMessage('Profile updated');
      router.push('/profile');
      router.refresh();
    } catch (err) {
      setMessage('Update failed: ' + (err?.message || err));
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-xl font-semibold">Edit profile</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name" className="w-full rounded border px-3 py-2" />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="w-full rounded border px-3 py-2" />
        <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website" className="w-full rounded border px-3 py-2" />
        <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="About" className="w-full rounded border px-3 py-2" />
        <div>
          <label className="block text-sm font-medium">Profile Photo (URL):</label>
          <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." className="w-full rounded border px-3 py-2" />
          <input type="file" accept="image/*" onChange={handleAvatarFile} className="mt-1 block" />
          {avatarUrl && <img src={avatarUrl} alt="avatar" className="mt-2 h-24 rounded-full" />}
        </div>
        <div>
          <label className="block text-sm font-medium">Cover Photo (URL):</label>
          <input value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="https://..." className="w-full rounded border px-3 py-2" />
          <input type="file" accept="image/*" onChange={handleCoverFile} className="mt-1 block" />
          {coverUrl && <img src={coverUrl} alt="cover" className="mt-2 w-full h-32 object-cover rounded-xl" />}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Social Links:</label>
          <SocialLinksInput value={socialLinks} onChange={setSocialLinks} />
        </div>
        {fieldError && <div className="text-red-600 text-sm mb-2">{fieldError}</div>}
        <button className="rounded bg-black px-4 py-2 text-white">Save</button>
      </form>
      {message && <p className="mt-3 text-sm text-zinc-700">{message}</p>}
    </div>
  );
}
