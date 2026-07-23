import { parseMcColorCode } from '@/lib/mcColor';

// Renders a Minecraft-style per-letter gradient name from an admin-editable
// color code (legacy &#RRGGBB&l or MiniMessage <#RRGGBB> format). Falls back
// to plain text when no code is set.
export function MinecraftText({
  code,
  fallback,
  className,
}: {
  code?: string | null;
  fallback: string;
  className?: string;
}) {
  const segments = code ? parseMcColorCode(code) : [];
  if (segments.length === 0) return <span className={className}>{fallback}</span>;
  return (
    <span className={className}>
      {segments.map((s, i) => (
        <span
          key={i}
          style={{ color: s.color, fontWeight: s.bold ? 700 : undefined, fontStyle: s.italic ? 'italic' : undefined }}
        >
          {s.text}
        </span>
      ))}
    </span>
  );
}
