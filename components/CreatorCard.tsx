import { Reveal } from '@/components/Reveal';
import { StaffSocialIcons } from '@/components/StaffSocialIcons';

// Shared visual for both the Staff directory and the Media Rank section:
// a photo, a rank badge, a name/subtitle pair, bio, and social icon row.
export function CreatorCard({
  rank,
  photoUrl,
  name,
  subtitle,
  bio,
  instagramUrl,
  youtubeUrl,
  discordUrl,
  delay = 0,
}: {
  rank: number;
  photoUrl: string | null;
  name: string;
  subtitle?: React.ReactNode;
  bio?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  discordUrl?: string | null;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="relative border border-white/10 overflow-hidden">
      <div className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-core-ember flex items-center justify-center text-void font-display text-xs font-black">
        #{rank}
      </div>
      <div className="h-56 bg-obsidian/60 overflow-hidden">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ash/40 font-display text-4xl">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-parchment">{name}</h3>
        {subtitle}
        {bio && <p className="text-sm text-ash mt-3 leading-relaxed">{bio}</p>}
        <StaffSocialIcons instagramUrl={instagramUrl} youtubeUrl={youtubeUrl} discordUrl={discordUrl} />
      </div>
    </Reveal>
  );
}
