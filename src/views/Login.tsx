'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { fieldClass } from '../utils/styles';
import { ApiError, login, saveLoginSession } from '../apis/auth';

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

const modules = ['Customers & sites', 'Tech officers & dispatch', 'Machines & meter readings', 'Breakdowns & service visits'];

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: LoginErrors = {};
    const normalizedEmail = email.trim();
    if (!normalizedEmail) next.email = 'Enter your work email';
    else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Enter your password';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const response = await login({
        email: normalizedEmail,
        password,
        deviceLabel: navigator.userAgent.slice(0, 100),
      });
      saveLoginSession(response, remember);
      router.replace('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({
          email: error.fieldErrors.email,
          password: error.fieldErrors.password,
          form: error.message,
        });
      } else {
        setErrors({ form: error instanceof Error ? error.message : 'Unable to sign in. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-[1fr_1fr]">
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-ink-muted">Welcome back. Sign in with your company account to continue.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <FormField label="Work email" htmlFor="email" error={errors.email}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email || errors.form) setErrors((p) => ({ ...p, email: undefined, form: undefined }));
                }}
                placeholder="you@gestetner.lk"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={fieldClass(!!errors.email)} />
              
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              error={errors.password}
              action={
              <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Forgot password?
                </button>
              }>
              
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password || errors.form) setErrors((p) => ({ ...p, password: undefined, form: undefined }));
                  }}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`${fieldClass(!!errors.password)} pr-10`} />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-subtle hover:text-ink">
                  
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-line text-brand-500 focus:ring-brand-500/30" />
              
              Keep me signed in on this device
            </label>

            {errors.form && (
              <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {errors.form}
              </p>
            )}

            <Button type="submit" loading={loading} disabled={loading} className="h-11 w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-8 text-xs leading-relaxed text-ink-subtle">
            Locked out or need access to another module? Contact IT support on ext. 2200.
          </p>
        </div>
      </main>

      <aside className="hidden flex-col justify-end bg-brand-900 p-12 text-white lg:flex">
        <p className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
          Customers, machines and field service — all in one place.
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-100">
          From the first sale to the hundredth service visit, every team works from the same record.
        </p>
        <ul className="mt-10 max-w-md divide-y divide-white/10 border-y border-white/10">
          {modules.map((module) =>
          <li key={module} className="py-3 text-sm text-brand-100">
              {module}
            </li>
          )}
        </ul>
      </aside>
    </div>);

}
