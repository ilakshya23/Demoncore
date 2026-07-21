'use client';

import { useState } from 'react';

export function CopyButton({ value, tooltip = 'Copy to clipboard' }: { value: string; tooltip?: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    // Optimistic: flip the label immediately, don't wait on the clipboard
    // promise to resolve before giving feedback.
    setCopied(true);
    navigator.clipboard.writeText(value).catch(() => {
      /* clipboard denied — the optimistic state still resets below */
    });
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative inline-block group">
      <button
        onClick={handleClick}
        className="cursor-target border border-white/15 px-3 py-1.5 text-xs uppercase tracking-wide text-parchment hover:border-core-ember transition-colors"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-obsidian border border-white/10 px-2 py-1 text-[11px] text-ash opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {tooltip}
      </span>
    </div>
  );
}
