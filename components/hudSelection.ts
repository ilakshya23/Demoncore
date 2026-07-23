type Listener = () => void;

let selectedIcon: string | null = null;
const listeners = new Set<Listener>();

export function getSelectedIcon() {
  return selectedIcon;
}

export function setSelectedIcon(src: string | null) {
  selectedIcon = src;
  listeners.forEach((listener) => listener());
}

export function subscribeSelectedIcon(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
