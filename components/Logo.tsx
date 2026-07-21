'use client';

export function LogoMark({ size = 40, className = '' }: { size?: number; className?: string }) {
  // A fractured hexagonal "core" — reads as a broken/cracked ore block split by
  // a molten seam, echoing the block-based world + the "core" in the name.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DEMONCORE MC"
    >
      <polygon
        points="32,4 58,18 58,46 32,60 6,46 6,18"
        fill="#141215"
        stroke="#3a3438"
        strokeWidth="1.5"
      />
      {/* fracture seam */}
      <path
        d="M32 4 L26 22 L36 30 L22 40 L32 60"
        stroke="#FF5A2E"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 4 L26 22 L36 30 L22 40 L32 60"
        stroke="#FFA46B"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="32" cy="30" r="3" fill="#FF5A2E">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display uppercase tracking-wide ${className}`}>
      Demon<span className="text-core-ember">Core</span>
    </span>
  );
}

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <Wordmark className="text-lg" />
    </div>
  );
}
