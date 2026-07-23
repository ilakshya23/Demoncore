'use client';

import { useState } from 'react';
import { SkinRenderer } from '@/components/SkinRenderer';

const STEVE_SKIN_TEXTURE = 'https://mc-heads.net/skin/MHF_Steve';

export function StaffSkinField({
  minecraftUsername,
  skinUrl,
  onChange,
}: {
  minecraftUsername: string;
  skinUrl: string;
  onChange: (patch: { minecraft_username: string; skin_url: string }) => void;
}) {
  const [mode, setMode] = useState<'premium' | 'cracked'>(skinUrl ? 'cracked' : 'premium');
  const [source, setSource] = useState<'url' | 'upload'>('url');
  const [username, setUsername] = useState(minecraftUsername);
  const [url, setUrl] = useState(skinUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/skin-upload', { method: 'POST', body: form });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Upload failed');
      setUrl(body.url);
      onChange({ minecraft_username: '', skin_url: body.url });
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="md:col-span-2">
      <label className="text-xs uppercase tracking-wide text-ash">Skin</label>

      <div className="cursor-target mt-1.5 flex gap-2 text-xs">
        {(['premium', 'cracked'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`cursor-target px-3 py-1.5 border uppercase tracking-wide ${
              mode === m ? 'border-core-ember text-core-ember' : 'border-white/15 text-ash hover:text-parchment'
            }`}
          >
            {m === 'premium' ? 'Premium account' : 'Cracked / custom skin'}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div>
          {mode === 'premium' ? (
            <>
              <label className="text-xs text-ash">Minecraft Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => onChange({ minecraft_username: username, skin_url: '' })}
                placeholder="e.g. Notch"
                className="cursor-target mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
              />
            </>
          ) : (
            <>
              <div className="cursor-target flex gap-2 text-xs mb-2">
                {(['url', 'upload'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSource(s)}
                    className={`cursor-target px-2.5 py-1 border uppercase tracking-wide ${
                      source === s ? 'border-core-ember text-core-ember' : 'border-white/15 text-ash hover:text-parchment'
                    }`}
                  >
                    {s === 'url' ? 'Paste URL' : 'Upload file'}
                  </button>
                ))}
              </div>
              {source === 'url' ? (
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={() => onChange({ minecraft_username: '', skin_url: url })}
                  placeholder="https://www.minecraftskins.com/uploads/skins/..."
                  className="cursor-target w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
                />
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/png,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                    className="cursor-target w-full text-xs text-ash file:cursor-target file:mr-3 file:border file:border-white/15 file:bg-obsidian file:px-3 file:py-1.5 file:text-parchment file:text-xs"
                  />
                  {uploading && <p className="text-xs text-ash mt-1.5">Uploading…</p>}
                </div>
              )}
              {error && <p className="text-xs text-core-ember mt-1.5">{error}</p>}
            </>
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-ash mb-1.5">Preview</span>
          <div className="h-32 w-24 flex items-end justify-center bg-obsidian/60 border border-white/10">
            {mode === 'cracked' && url ? (
              <SkinRenderer skinUrl={url} fallbackTextureUrl={STEVE_SKIN_TEXTURE} width={80} height={128} />
            ) : mode === 'premium' && username ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://mc-heads.net/body/${encodeURIComponent(username)}/128`}
                alt="preview"
                className="h-full w-auto object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <span className="text-xs text-ash/50 mb-4">No skin set</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
