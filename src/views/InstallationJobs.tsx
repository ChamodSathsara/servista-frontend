'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  Clock3Icon,
  MapPinIcon,
  SearchIcon,
  SearchXIcon,
  UserRoundIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getInstallationJob,
  getInstallationJobs,
  completeInstallationJob,
  type InstallationJobResponse,
} from '../apis/installationJobs';
import { createInstallationSubmission, type AgreementTypeRequested } from '../apis/installationSubmissions';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { StatusBadge, type BadgeTone } from '../components/ui/StatusBadge';
import { formatDate } from '../utils/format';
import { fieldClass } from '../utils/styles';

const statusTone = (status: string): BadgeTone => {
  const value = status.toUpperCase();
  if (['COMPLETED', 'INSTALLED', 'CLOSED'].includes(value)) return 'success';
  if (['CANCELLED', 'FAILED', 'REJECTED'].includes(value)) return 'danger';
  if (['PENDING', 'ON_HOLD', 'SCHEDULED'].includes(value)) return 'warning';
  if (['ASSIGNED', 'IN_PROGRESS'].includes(value)) return 'info';
  return 'neutral';
};

const statusLabel = (status: string) =>
  status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

const displayDate = (value: string | null) => (value ? formatDate(value) : '—');

const submittableStatuses = new Set(['ASSIGNED', 'IN_PROGRESS', 'REJECTED']);

export function InstallationJobs() {
  const [jobs, setJobs] = useState<InstallationJobResponse[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<InstallationJobResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [machineId, setMachineId] = useState('');
  const [modelId, setModelId] = useState('');
  const [siteContactId, setSiteContactId] = useState('');
  const [installDate, setInstallDate] = useState('');
  const [initialMeterReading, setInitialMeterReading] = useState('');
  const [agreementType, setAgreementType] = useState<AgreementTypeRequested | ''>('');
  const [warrantyNote, setWarrantyNote] = useState('');
  const [submissionStatusNote, setSubmissionStatusNote] = useState('Installation submitted by technician');
  const [submissionErrors, setSubmissionErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setJobs(await getInstallationJobs());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load installation jobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getInstallationJobs()
      .then((result) => {
        if (!cancelled) setJobs(result);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load installation jobs.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const statuses = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.status))).sort(),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesStatus = status === 'ALL' || job.status === status;
      const matchesQuery = !normalizedQuery || [
        job.jobNumber,
        job.customerName,
        job.siteName,
        job.invoiceNumber,
        job.technicianName,
      ].some((value) => value?.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesQuery;
    });
  }, [jobs, query, status]);

  const openJob = async (job: InstallationJobResponse) => {
    setSelected(null);
    setDetailLoading(true);
    try {
      setSelected(await getInstallationJob(job.installationJobId));
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : 'Unable to load installation job.');
    } finally {
      setDetailLoading(false);
    }
  };

  const currentUserId = () => {
    const storedUser = localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');
    try {
      const userId = storedUser ? Number((JSON.parse(storedUser) as { userId?: number }).userId) : 0;
      if (!userId) throw new Error();
      return userId;
    } catch {
      throw new Error('Your user session is missing. Please sign in again.');
    }
  };

  const showCompleteDialog = (job: InstallationJobResponse | null = selected) => {
    if (!job || job.status !== 'VERIFIED') return;
    setSelected(job);
    setCompletionNote('');
    setCompletionError(null);
    setCompleteDialogOpen(true);
  };

  const completeJob = async () => {
    if (!selected) return;
    const note = completionNote.trim();
    if (note.length > 255) {
      setCompletionError('Note must be 255 characters or fewer.');
      return;
    }

    setCompleting(true);
    setCompletionError(null);
    try {
      const completed = await completeInstallationJob(selected.installationJobId, {
        performedBy: currentUserId(),
        note: note || null,
      });
      setJobs((current) => current.map((job) =>
        job.installationJobId === completed.installationJobId ? completed : job,
      ));
      setSelected(completed);
      setCompleteDialogOpen(false);
      setCompletionNote('');
      toast.success(`${completed.jobNumber} completed successfully`);
    } catch (completeError) {
      const message = completeError instanceof Error
        ? completeError.message
        : 'Unable to complete the installation job.';
      setCompletionError(message);
      toast.error(message);
    } finally {
      setCompleting(false);
    }
  };

  const showSubmissionDialog = (job: InstallationJobResponse | null = selected) => {
    if (!job || !submittableStatuses.has(job.status)) return;
    setSelected(job);
    setMachineId('');
    setModelId('');
    setSiteContactId('');
    setInstallDate(job.expectedInstallDate ?? new Date().toISOString().slice(0, 10));
    setInitialMeterReading('');
    setAgreementType('');
    setWarrantyNote('');
    setSubmissionStatusNote('Installation submitted by technician');
    setSubmissionErrors({});
    setSubmissionDialogOpen(true);
  };

  const submitInstallation = async () => {
    if (!selected) return;
    const errors: Record<string, string> = {};
    if (!Number(machineId)) errors.machineId = 'Machine ID is required.';
    if (!Number(modelId)) errors.modelId = 'Model ID is required.';
    if (!Number(siteContactId)) errors.siteContactId = 'Site contact ID is required.';
    if (!installDate) errors.installDate = 'Install date is required.';
    if (initialMeterReading && Number(initialMeterReading) < 0) errors.initialMeterReading = 'Meter reading cannot be negative.';
    if (warrantyNote.length > 255) errors.warrantyNote = 'Maximum 255 characters.';
    if (submissionStatusNote.length > 255) errors.statusNote = 'Maximum 255 characters.';
    setSubmissionErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const submission = await createInstallationSubmission({
        installationJobId: selected.installationJobId,
        machineId: Number(machineId),
        modelId: Number(modelId),
        customerSiteId: selected.customerSiteId,
        siteContactId: Number(siteContactId),
        installDate,
        initialMeterReading: initialMeterReading ? Number(initialMeterReading) : null,
        agreementTypeRequested: agreementType || null,
        warrantyNote: warrantyNote.trim() || null,
        submittedBy: currentUserId(),
        verificationStatus: 'PENDING_VERIFICATION',
        verifiedBy: null,
        verificationNote: null,
        statusNote: submissionStatusNote.trim() || null,
      });
      const updated = await getInstallationJob(selected.installationJobId);
      setJobs((current) => current.map((job) => job.installationJobId === updated.installationJobId ? updated : job));
      setSelected(updated);
      setSubmissionDialogOpen(false);
      toast.success(`${submission.jobNumber} submitted successfully`);
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Unable to submit the installation.';
      setSubmissionErrors({ form: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Installation Jobs</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {jobs.length} {jobs.length === 1 ? 'installation job' : 'installation jobs'}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="flex h-10 flex-1 items-center rounded-lg border border-line sm:max-w-xl">
            <SearchIcon className="ml-3 h-4 w-4 text-ink-subtle" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search job, customer, site, invoice or technician"
              aria-label="Search installation jobs"
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="mr-2 rounded p-1 text-ink-subtle hover:text-ink">
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
            className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-500"
          >
            <option value="ALL">All statuses</option>
            {statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="px-6 py-16 text-center text-sm text-ink-muted">Loading installation jobs…</p>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-danger-700">{error}</p>
            <Button variant="secondary" className="mt-5" onClick={() => void loadJobs()}>Try again</Button>
          </div>
        ) : filteredJobs.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-line bg-canvas/60 text-xs text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Job</th>
                  <th className="px-5 py-3 font-medium">Customer &amp; site</th>
                  <th className="px-5 py-3 font-medium">Technician</th>
                  <th className="px-5 py-3 font-medium">Expected date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredJobs.map((job) => (
                  <tr
                    key={job.installationJobId}
                    onClick={() => void openJob(job)}
                    className="group cursor-pointer transition-colors hover:bg-brand-50/50"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-mono font-medium text-ink group-hover:text-brand-700">{job.jobNumber}</p>
                      <p className="mt-0.5 text-xs text-ink-subtle">{job.invoiceNumber}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-ink">{job.customerName}</p>
                      <p className="mt-0.5 text-xs text-ink-subtle">{job.siteName}</p>
                    </td>
                    <td className="px-5 py-3.5 text-ink-muted">{job.technicianName || '—'}</td>
                    <td className="px-5 py-3.5 text-ink-muted">{displayDate(job.expectedInstallDate)}</td>
                    <td className="px-5 py-3.5"><StatusBadge tone={statusTone(job.status)} label={statusLabel(job.status)} /></td>
                    <td className="px-5 py-3.5 text-right">
                      {submittableStatuses.has(job.status) ? (
                        <Button className="h-8 px-3" onClick={(event) => { event.stopPropagation(); showSubmissionDialog(job); }}>
                          Submit installation
                        </Button>
                      ) : job.status === 'VERIFIED' ? (
                        <Button className="h-8 px-3" onClick={(event) => { event.stopPropagation(); showCompleteDialog(job); }}>
                          Complete
                        </Button>
                      ) : (
                        <span className="text-xs font-medium text-ink-muted">
                          {statusLabel(job.status)}
                        </span>
                      )}
                    </td>
                    <td className="pr-4"><ChevronRightIcon className="h-4 w-4 text-ink-subtle group-hover:text-brand-700" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <SearchXIcon className="mx-auto h-8 w-8 text-ink-subtle" />
            <p className="mt-3 text-sm font-medium text-ink">No installation jobs found</p>
            <p className="mt-1 text-xs text-ink-subtle">Try changing the search or status filter.</p>
          </div>
        )}
      </div>

      <Drawer
        open={detailLoading || !!selected}
        onClose={() => { setSelected(null); setDetailLoading(false); }}
        labelledBy="installation-job-title"
        widthClass="max-w-2xl"
      >
        <div className="px-6 py-7 sm:px-8">
          {detailLoading ? (
            <p className="py-16 text-center text-sm text-ink-muted">Loading job details…</p>
          ) : selected && (
            <>
              <div className="pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-ink-muted">ID #{selected.installationJobId}</span>
                  <StatusBadge tone={statusTone(selected.status)} label={statusLabel(selected.status)} />
                </div>
                <h2 id="installation-job-title" className="mt-2 font-mono text-xl font-semibold text-ink">{selected.jobNumber}</h2>
                <p className="mt-1 text-sm text-ink-muted">{selected.customerName}</p>
              </div>

              {submittableStatuses.has(selected.status) && (
                <Button className="mt-5" onClick={() => showSubmissionDialog()}>Submit installation</Button>
              )}
              {selected.status === 'VERIFIED' && (
                <Button className="mt-5" icon={<CheckCircle2Icon className="h-4 w-4" />} onClick={() => showCompleteDialog()}>
                  Complete installation
                </Button>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-canvas/50 p-4">
                  <MapPinIcon className="h-4 w-4 text-brand-600" />
                  <p className="mt-2 text-xs text-ink-subtle">Installation site</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{selected.siteName}</p>
                </div>
                <div className="rounded-lg border border-line bg-canvas/50 p-4">
                  <UserRoundIcon className="h-4 w-4 text-brand-600" />
                  <p className="mt-2 text-xs text-ink-subtle">Assigned technician</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{selected.technicianName || '—'}</p>
                </div>
                <div className="rounded-lg border border-line bg-canvas/50 p-4">
                  <CalendarDaysIcon className="h-4 w-4 text-brand-600" />
                  <p className="mt-2 text-xs text-ink-subtle">Expected installation</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{displayDate(selected.expectedInstallDate)}</p>
                </div>
                <div className="rounded-lg border border-line bg-canvas/50 p-4">
                  <ClipboardCheckIcon className="h-4 w-4 text-brand-600" />
                  <p className="mt-2 text-xs text-ink-subtle">Machine invoice</p>
                  <p className="mt-0.5 font-mono text-sm font-medium text-ink">{selected.invoiceNumber}</p>
                </div>
              </div>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-3">
                {[
                  ['Company', selected.company],
                  ['Division', selected.division],
                  ['Customer ID', selected.customerId],
                  ['Site ID', selected.customerSiteId],
                  ['Invoice ID', selected.machineInvoiceId],
                  ['Technician ID', selected.assignedTechnicianId],
                  ['Dealer ID', selected.dealerId],
                  ['Rep ID', selected.repId],
                  ['Created by', selected.createdBy],
                  ['Created at', new Date(selected.createdAt).toLocaleString()],
                ].map(([label, value]) => (
                  <div key={String(label)}>
                    <dt className="text-xs text-ink-subtle">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <section className="mt-8 border-t border-line pt-6">
                <div className="flex items-center gap-2">
                  <Clock3Icon className="h-4 w-4 text-ink-muted" />
                  <h3 className="text-sm font-semibold text-ink">Status history</h3>
                </div>
                {selected.statusHistory.length ? (
                  <ol className="mt-4 space-y-4 border-l border-line pl-5">
                    {[...selected.statusHistory].sort((a, b) => Date.parse(b.changedAt) - Date.parse(a.changedAt)).map((entry) => (
                      <li key={entry.installationStatusHistoryId} className="relative">
                        <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-4 ring-white" />
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge tone={statusTone(entry.newStatus)} label={statusLabel(entry.newStatus)} />
                          {entry.previousStatus && <span className="text-xs text-ink-subtle">from {statusLabel(entry.previousStatus)}</span>}
                        </div>
                        <p className="mt-1.5 text-xs text-ink-muted">{new Date(entry.changedAt).toLocaleString()} · User #{entry.changedBy}</p>
                        {entry.note && <p className="mt-1.5 text-sm text-ink">{entry.note}</p>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-4 text-sm text-ink-muted">No status changes have been recorded.</p>
                )}
              </section>
            </>
          )}
        </div>
      </Drawer>

      <Modal
        open={completeDialogOpen}
        onClose={() => { if (!completing) setCompleteDialogOpen(false); }}
        title="Complete installation job"
        description={selected ? `${selected.jobNumber} · ${selected.customerName}` : undefined}
        widthClass="max-w-lg"
        footer={(
          <div className="flex justify-end gap-3">
            <Button variant="ghost" disabled={completing} onClick={() => setCompleteDialogOpen(false)}>Cancel</Button>
            <Button
              loading={completing}
              icon={<CheckCircle2Icon className="h-4 w-4" />}
              onClick={() => void completeJob()}
            >
              Complete job
            </Button>
          </div>
        )}
      >
        <div className="space-y-4">
          <p className="rounded-lg border border-success-600/20 bg-success-50 px-4 py-3 text-sm text-success-700">
            This will change the installation status from Verified to Completed and add a status-history record.
          </p>
          <FormField
            label="Completion note"
            htmlFor="installation-completion-note"
            error={completionError ?? undefined}
            hint="Optional. Maximum 255 characters."
            action={<span className="text-xs text-ink-subtle">{completionNote.length}/255</span>}
          >
            <textarea
              id="installation-completion-note"
              value={completionNote}
              maxLength={255}
              rows={4}
              disabled={completing}
              placeholder="Installation completed and verified successfully"
              onChange={(event) => {
                setCompletionNote(event.target.value);
                setCompletionError(null);
              }}
              className={`${fieldClass(!!completionError)} resize-none py-2`}
            />
          </FormField>
        </div>
      </Modal>

      <Modal
        open={submissionDialogOpen}
        onClose={() => { if (!submitting) setSubmissionDialogOpen(false); }}
        title="Submit installation"
        description={selected ? `${selected.jobNumber} · ${selected.customerName}` : undefined}
        widthClass="max-w-2xl"
        footer={<div className="flex justify-end gap-3"><Button variant="ghost" disabled={submitting} onClick={() => setSubmissionDialogOpen(false)}>Cancel</Button><Button loading={submitting} onClick={() => void submitInstallation()}>Submit installation</Button></div>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {submissionErrors.form && <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700 sm:col-span-2">{submissionErrors.form}</p>}
          <FormField label="Machine ID" htmlFor="submission-machine-id" required error={submissionErrors.machineId}><input id="submission-machine-id" type="number" min="1" value={machineId} disabled={submitting} onChange={(event) => { setMachineId(event.target.value); setSubmissionErrors((current) => ({ ...current, machineId: '' })); }} className={fieldClass(!!submissionErrors.machineId)} /></FormField>
          <FormField label="Model ID" htmlFor="submission-model-id" required error={submissionErrors.modelId}><input id="submission-model-id" type="number" min="1" value={modelId} disabled={submitting} onChange={(event) => { setModelId(event.target.value); setSubmissionErrors((current) => ({ ...current, modelId: '' })); }} className={fieldClass(!!submissionErrors.modelId)} /></FormField>
          <FormField label="Customer site ID" htmlFor="submission-site-id" required hint="Filled from the installation job."><input id="submission-site-id" value={selected?.customerSiteId ?? ''} disabled className={fieldClass()} /></FormField>
          <FormField label="Site contact ID" htmlFor="submission-contact-id" required error={submissionErrors.siteContactId}><input id="submission-contact-id" type="number" min="1" value={siteContactId} disabled={submitting} onChange={(event) => { setSiteContactId(event.target.value); setSubmissionErrors((current) => ({ ...current, siteContactId: '' })); }} className={fieldClass(!!submissionErrors.siteContactId)} /></FormField>
          <FormField label="Installation date" htmlFor="submission-install-date" required error={submissionErrors.installDate}><input id="submission-install-date" type="date" value={installDate} disabled={submitting} onChange={(event) => { setInstallDate(event.target.value); setSubmissionErrors((current) => ({ ...current, installDate: '' })); }} className={fieldClass(!!submissionErrors.installDate)} /></FormField>
          <FormField label="Initial meter reading" htmlFor="submission-meter" error={submissionErrors.initialMeterReading}><input id="submission-meter" type="number" min="0" value={initialMeterReading} disabled={submitting} onChange={(event) => { setInitialMeterReading(event.target.value); setSubmissionErrors((current) => ({ ...current, initialMeterReading: '' })); }} className={fieldClass(!!submissionErrors.initialMeterReading)} /></FormField>
          <FormField label="Agreement requested" htmlFor="submission-agreement"><select id="submission-agreement" value={agreementType} disabled={submitting} onChange={(event) => setAgreementType(event.target.value as AgreementTypeRequested | '')} className={fieldClass()}><option value="">None</option><option value="FS">FS</option><option value="MA">MA</option><option value="NS">NS</option></select></FormField>
          <FormField label="Warranty note" htmlFor="submission-warranty-note" error={submissionErrors.warrantyNote} className="sm:col-span-2" action={<span className="text-xs text-ink-subtle">{warrantyNote.length}/255</span>}><textarea id="submission-warranty-note" value={warrantyNote} maxLength={255} rows={3} disabled={submitting} onChange={(event) => { setWarrantyNote(event.target.value); setSubmissionErrors((current) => ({ ...current, warrantyNote: '' })); }} className={`${fieldClass(!!submissionErrors.warrantyNote)} resize-none py-2`} /></FormField>
          <FormField label="Status history note" htmlFor="submission-status-note" error={submissionErrors.statusNote} className="sm:col-span-2" hint="Optional. Maximum 255 characters." action={<span className="text-xs text-ink-subtle">{submissionStatusNote.length}/255</span>}><textarea id="submission-status-note" value={submissionStatusNote} maxLength={255} rows={3} disabled={submitting} onChange={(event) => { setSubmissionStatusNote(event.target.value); setSubmissionErrors((current) => ({ ...current, statusNote: '' })); }} className={`${fieldClass(!!submissionErrors.statusNote)} resize-none py-2`} /></FormField>
        </div>
      </Modal>
    </div>
  );
}
