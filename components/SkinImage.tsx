'use client';

export function SkinImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-auto object-contain"
      style={{ imageRendering: 'pixelated' }}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
      }}
    />
  );
}
