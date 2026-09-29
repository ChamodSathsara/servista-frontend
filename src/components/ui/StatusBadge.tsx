
export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  tone: BadgeTone;
  label: string;
}

const toneClass: Record<BadgeTone, string> = {
  success: 'bg-success-50 text-success-700 ring-success-700/15',
  warning: 'bg-warning-50 text-warning-700 ring-warning-700/15',
  danger: 'bg-danger-50 text-danger-700 ring-danger-700/15',
  info: 'bg-brand-50 text-brand-700 ring-brand-700/15',
  neutral: 'bg-canvas text-ink-muted ring-ink/10'
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${toneClass[tone]}`}>
      
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>);

}