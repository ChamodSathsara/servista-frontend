'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2Icon, EyeIcon, EyeOffIcon, HeadphonesIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { fieldClass } from '../utils/styles';
import { ApiError, login, saveLoginSession } from '../apis/auth';

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

const modules = [
  'Manage customers and machines in one place',
  'Coordinate field teams with real-time updates',
  'Track service visits from request to resolution',
];

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
      router.replace(response.role.toUpperCase() === 'TECHNICIAN' ? '/breakdowns' : '/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ email: error.fieldErrors.email, password: error.fieldErrors.password, form: error.message });
      } else {
        setErrors({ form: error instanceof Error ? error.message : 'Unable to sign in. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen w-full overflow-hidden bg-[#f7f9fc] lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
      <aside className="relative hidden overflow-hidden bg-brand-900 text-white lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-20">
        <div aria-hidden="true" className="absolute -left-28 -top-32 h-96 w-96 rounded-full border-[70px] border-white/[0.035]" />
        <div aria-hidden="true" className="absolute -bottom-36 -right-28 h-[30rem] w-[30rem] rounded-full bg-brand-500/20 blur-3xl" />
        <div aria-hidden="true" className="absolute bottom-1/4 right-20 h-2 w-2 rounded-full bg-white/40" />

        <div className="relative z-10">
          <div className="inline-flex rounded-2xl bg-white px-5 py-3 shadow-lg shadow-black/10">
            <Image src="/footer-logo-removebg-preview.png" alt="Gestetner of Ceylon" width={278} height={90} priority className="h-14 w-auto object-contain" />
          </div>
        </div>

        <div className="relative z-10 max-w-xl pb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-brand-100 backdrop-blur-sm">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Secure company portal
          </span>
          <h2 className="mt-7 text-4xl font-semibold leading-[1.15] tracking-[-0.035em] xl:text-5xl">
            Service operations,<br />made effortless.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-brand-100/80">
            Keep your customers, machines and field service teams connected through one reliable workspace.
          </p>
          <ul className="mt-9 space-y-4">
            {modules.map((module) => (
              <li key={module} className="flex items-center gap-3 text-sm text-white/90">
                <CheckCircle2Icon className="h-5 w-5 shrink-0 text-sky-300" />
                {module}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-brand-100/55">Gestetner ERP · Built for better service</p>
      </aside>

      <main className="relative flex items-center justify-center px-5 py-10 sm:px-8 lg:bg-white lg:px-12">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-sky-400 to-accent-500 lg:hidden" />
        <div className="w-full max-w-md">
          <div className="mb-10 flex justify-center lg:hidden">
            <Image src="/footer-logo-removebg-preview.png" alt="Gestetner of Ceylon" width={278} height={90} priority className="h-16 w-auto object-contain" />
          </div>

          <div className="rounded-2xl border border-line/80 bg-white p-6 shadow-[0_18px_55px_-30px_rgba(15,42,79,0.3)] sm:p-9 lg:border-0 lg:p-0 lg:shadow-none">
            <p className="text-sm font-semibold text-brand-600">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">Sign in to your account</h1>
            <p className="mt-3 text-sm leading-6 text-ink-muted">Enter your company credentials to access the ERP system.</p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <FormField label="Work email" htmlFor="email" error={errors.email}>
                <input id="email" type="email" autoComplete="email" autoFocus value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (errors.email || errors.form) setErrors((previous) => ({ ...previous, email: undefined, form: undefined }));
                  }}
                  placeholder="you@gestetner.lk" aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined} className={fieldClass(!!errors.email)} />
              </FormField>

              <FormField label="Password" htmlFor="password" error={errors.password} action={
                <button type="button" className="rounded text-xs font-semibold text-brand-600 outline-none transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500/40">
                  Forgot password?
                </button>
              }>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (errors.password || errors.form) setErrors((previous) => ({ ...previous, password: undefined, form: undefined }));
                    }}
                    placeholder="Enter your password" aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined} className={`${fieldClass(!!errors.password)} pr-10`} />
                  <button type="button" onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-ink-subtle outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/40">
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </FormField>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted">
                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500/30" />
                Keep me signed in on this device
              </label>

              {errors.form && <p role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">{errors.form}</p>}

              <Button type="submit" loading={loading} disabled={loading} className="h-12 w-full shadow-lg shadow-brand-500/20 transition-transform active:scale-[0.99]">
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-8 flex items-start gap-3 border-t border-line pt-6 text-xs leading-relaxed text-ink-subtle">
              <HeadphonesIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <p>Locked out or need access to another module? Contact IT support on ext. 2200.</p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-ink-subtle lg:text-left">© {new Date().getFullYear()} Gestetner of Ceylon PLC. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
