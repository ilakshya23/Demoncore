import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

const raisedBevel = { border: '2px solid #000', boxShadow: 'inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #7B7B7B' };
const sunkenBevel = {
  border: '2px solid #000',
  boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.55), inset -1px -1px 0 rgba(255,255,255,0.12)',
};

// Classic Minecraft/Java-launcher dialog styling: a raised gray panel with
// sunken dark text fields — see the reference "Account" login box.
export function MinecraftPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div style={raisedBevel} className={`bg-[#C6C6C6] p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}

export function MinecraftField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-black/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const fieldClass = 'cursor-target w-full bg-obsidian px-3 py-2.5 text-parchment placeholder:text-ash/50 outline-none';

export function MinecraftInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={sunkenBevel} className={`${fieldClass} ${props.className ?? ''}`} />;
}

export function MinecraftTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={sunkenBevel} className={`${fieldClass} resize-none ${props.className ?? ''}`} />;
}

export function MinecraftSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={sunkenBevel} className={`${fieldClass} ${props.className ?? ''}`} />;
}

export function MinecraftButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={raisedBevel}
      className={`cursor-target bg-[#C6C6C6] text-black font-display uppercase tracking-wide px-7 py-3 hover:brightness-95 active:brightness-90 transition-[filter] disabled:opacity-60 ${props.className ?? ''}`}
    />
  );
}
