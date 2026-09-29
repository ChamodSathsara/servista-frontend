'use client';


interface SegmentOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  compact?: boolean;
}

export function SegmentedControl<T extends string>({ options, value, onChange, ariaLabel, compact }: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex shrink-0 rounded-lg bg-canvas p-0.5 ring-1 ring-inset ring-line">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-[background-color,color] duration-150 ${
            compact ? 'h-7 px-2.5 text-xs' : 'h-9 px-3 text-sm'} ${
            active ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}>
            
            {option.label}
            {option.count !== undefined &&
            <span className={`tabular-nums text-xs ${active ? 'text-brand-600' : 'text-ink-subtle'}`}>{option.count}</span>
            }
          </button>);

      })}
    </div>);

}