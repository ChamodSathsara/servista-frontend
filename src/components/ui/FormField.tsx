import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, required, error, hint, action, className = '', children }: FormFieldProps) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required &&
          <span className="ml-0.5 text-accent-500" aria-hidden="true">
              *
            </span>
          }
        </label>
        {action}
      </div>
      {children}
      {error ?
      <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-danger-700" role="alert">
          {error}
        </p> :

      hint && <p className="mt-1.5 text-xs text-ink-subtle">{hint}</p>
      }
    </div>);

}