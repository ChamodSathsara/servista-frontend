import { format, parseISO } from 'date-fns';

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy');
}

export function initials(name: string): string {
  return name.
  replace(/[^A-Za-z\s]/g, '').
  split(/\s+/).
  filter(Boolean).
  slice(0, 2).
  map((part) => part[0].toUpperCase()).
  join('');
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}