export const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function fieldClass(hasError?: boolean): string {
  return [
  'w-full h-10 rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-ink-subtle',
  'focus:outline-none focus:ring-2 transition-[border-color,box-shadow] duration-150',
  'disabled:bg-canvas disabled:text-ink-muted',
  hasError ?
  'border-danger-600 focus:ring-danger-600/20' :
  'border-line focus:border-brand-500 focus:ring-brand-500/20'].
  join(' ');
}