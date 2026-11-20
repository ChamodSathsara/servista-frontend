"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, PlusIcon, SearchIcon, SearchXIcon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import {
  createMachine,
  createMachineModel,
  deleteMachine,
  getMachine,
  getMachineModels,
  getMachinesPage,
  updateMachine,
  transferMachineCustomer,
  changeMachineTechnicians,
  returnMachineToStock,
  getMachineHistory,
  createCustomerSite,
  downloadInitialMachineTemplate,
  importInitialMachines,
  type MachineHistoryEvent,
  type MachineModelRequest,
  type MachineModelResponse,
  type MachineRequest,
  type MachineResponse,
} from "../apis/machines";
import { createCustomer, getCustomers, type ApiCustomerGrade, type ApiCustomerSegment, type ApiCustomerType, type CustomerResponse } from "../apis/customers";
import { getTechnicians, type TechnicianResponse } from "../apis/technicians";
import { getSalesmen, type SalesmanResponse } from "../apis/salesmen";
import { ApiError } from "../apis/http";
import { Button } from "../components/ui/Button";
import { MachinesTable } from "../components/machines/MachinesTable";
import { MachineDrawer } from "../components/machines/MachineDrawer";
import { MachineDialog } from "../components/machines/MachineDialog";
import { CustomerTransferDialog, ReturnToStockDialog, TechnicianChangeDialog } from "../components/machines/MachineWorkflowDialogs";
import { MachineHistoryDialog } from "../components/machines/MachineHistoryDialog";
import { CreateCustomerDialog } from "../components/customers/CreateCustomerDialog";
import type { CustomerFormValues } from "../hooks/useCreateCustomerForm";
import type { CustomerSiteFormValue } from "../components/machines/CreateCustomerSiteDialog";
import { MachineModelDialog } from "../components/machineModels/MachineModelDialog";
import { CityDialog } from "../components/cities/CityDialog";
import {
  createCity,
  getCities,
  type CityRequest,
  type CityResponse,
} from "../apis/cities";

export function Machines() {
  const [machines, setMachines] = useState<MachineResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
  const [salesmen, setSalesmen] = useState<SalesmanResponse[]>([]);
  const [models, setModels] = useState<MachineModelResponse[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<MachineResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MachineResponse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [customerTransferMachine, setCustomerTransferMachine] = useState<MachineResponse | null>(null);
  const [technicianChangeMachine, setTechnicianChangeMachine] = useState<MachineResponse | null>(null);
  const [returnMachine, setReturnMachine] = useState<MachineResponse | null>(null);
  const [historyMachine, setHistoryMachine] = useState<MachineResponse | null>(null);
  const [historyEvents, setHistoryEvents] = useState<MachineHistoryEvent[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [customerCreateOpen, setCustomerCreateOpen] = useState(false);
  const [transferInitialCustomerId, setTransferInitialCustomerId] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        machineData,
        customerData,
        techData,
        salesmanData,
        modelData,
        cityData,
      ] = await Promise.all([
        getMachinesPage({ page: 0, size: 20 }),
        getCustomers(),
        getTechnicians(),
        getSalesmen(),
        getMachineModels(),
        getCities(),
      ]);
      setMachines(machineData.content);
      setPage(machineData.number);
      setTotalPages(machineData.totalPages);
      setTotalElements(machineData.totalElements);
      setCustomers(customerData);
      setTechnicians(techData);
      setSalesmen(salesmanData);
      setModels(modelData);
      setCities(cityData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load machines.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getCustomers(),
      getTechnicians(),
      getSalesmen(),
      getMachineModels(),
      getCities(),
    ])
      .then(([b, c, d, e, f]) => {
        if (!cancelled) {
          setCustomers(b);
          setTechnicians(c);
          setSalesmen(d);
          setModels(e);
          setCities(f);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Unable to load machines.");
      })
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setSearching(true);
      setError(null);
      getMachinesPage({ page, size: 20, query })
        .then((data) => {
          if (!cancelled) {
            setMachines(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
          }
        })
        .catch((e: unknown) => {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : "Unable to load machines.");
            toast.error(e instanceof Error ? e.message : "Search failed.");
          }
        })
        .finally(() => {
          if (!cancelled) {
            setSearching(false);
            setLoading(false);
          }
        });
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [page, query]);
  const clearSearch = () => {
    setQuery("");
    setPage(0);
  };
  const userId = () => {
    const raw =
      localStorage.getItem("currentUser") ??
      sessionStorage.getItem("currentUser");
    const id = raw
      ? Number((JSON.parse(raw) as { userId?: number }).userId)
      : 0;
    if (!id)
      throw new Error("Your user session is missing. Please sign in again.");
    return id;
  };
  const openDetails = async (m: MachineResponse) => {
    setSelected(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      setSelected(await getMachine(m.machineId));
    } catch (e) {
      setDetailError(
        e instanceof Error ? e.message : "Unable to load machine.",
      );
    } finally {
      setDetailLoading(false);
    }
  };
  const save = async (request: Omit<MachineRequest, "performedBy">) => {
    try {
      const result = editing
        ? await updateMachine(editing.machineId, {
            ...request,
            performedBy: userId(),
          })
        : await createMachine({ ...request, performedBy: userId() });
      setMachines((p) =>
        editing
          ? p.map((m) => (m.machineId === result.machineId ? result : m))
          : [result, ...p],
      );
      setSelected(result);
      setDialogOpen(false);
      setEditing(null);
      toast.success(editing ? "Machine updated" : "Machine created", {
        description: result.machineReferenceNumber,
      });
    } catch (e) {
      toast.error(
        e instanceof ApiError || e instanceof Error
          ? e.message
          : "Unable to save machine.",
      );
      throw e;
    }
  };
  const remove = async (m: MachineResponse) => {
    if (
      !window.confirm(
        `Delete ${m.machineReferenceNumber}? This cannot be undone.`,
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteMachine(m.machineId);
      setMachines((p) => p.filter((x) => x.machineId !== m.machineId));
      setSelected(null);
      toast.success("Machine deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to delete machine.");
    } finally {
      setDeleting(false);
    }
  };
  const addModel = async (request: Omit<MachineModelRequest, "createdBy">) => {
    try {
      const created = await createMachineModel({
        ...request,
        createdBy: userId(),
      });
      setModels((previous) => [...previous, created]);
      setModelDialogOpen(false);
      toast.success(`${created.modelNumber} added to model list`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to create model.");
      throw e;
    }
  };
  const addCity = async (request: CityRequest) => {
    try {
      const created = await createCity(request);
      setCities((previous) => [...previous, created]);
      setCityDialogOpen(false);
      toast.success(`${created.cityName} added to city list`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to create city.");
      throw e;
    }
  };
  const applyWorkflowResult = (result: MachineResponse) => {
    setMachines((previous) => previous.map((machine) => machine.machineId === result.machineId ? result : machine));
    setSelected(result);
  };
  const changeCustomer = async (value: { customerId: number; customerSiteId: number; assignmentType: "OUTRIGHT_SALE" | "RENTAL"; effectiveDate: string; reason: string }) => {
    if (!customerTransferMachine) return;
    const result = await transferMachineCustomer(customerTransferMachine.machineId, { ...value, performedBy: userId(), reason: value.reason || null });
    applyWorkflowResult(result); setCustomerTransferMachine(null); setTransferInitialCustomerId(null); toast.success("Machine customer changed");
  };
  const changeTechnicians = async (value: { mainTechnicianId: number | null; serviceTechnicianId: number | null; effectiveDate: string; reason: string }) => {
    if (!technicianChangeMachine) return;
    const result = await changeMachineTechnicians(technicianChangeMachine.machineId, { ...value, performedBy: userId(), reason: value.reason || null });
    applyWorkflowResult(result); setTechnicianChangeMachine(null); toast.success("Technician assignments updated");
  };
  const returnToStock = async (value: { returnDate: string; reason: string }) => {
    if (!returnMachine) return;
    const result = await returnMachineToStock(returnMachine.machineId, { ...value, performedBy: userId() });
    applyWorkflowResult(result); setReturnMachine(null); toast.success("Machine returned to company stock");
  };
  const openHistory = async (machine: MachineResponse) => {
    setHistoryMachine(machine); setHistoryEvents([]); setHistoryLoading(true);
    try { setHistoryEvents(await getMachineHistory(machine.machineId)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Unable to load machine history."); }
    finally { setHistoryLoading(false); }
  };
  const createTransferCustomer = async (value: CustomerFormValues) => {
    const created = await createCustomer({
      ...(value.sageCode.trim() ? { sageCode: value.sageCode.trim() } : {}),
      customerName: value.customerName.trim(), addressLine1: value.addressLine1.trim() || undefined,
      addressLine2: value.addressLine2.trim() || undefined, addressLine3: value.addressLine3.trim() || undefined,
      headOfficeTelNumber: value.headOfficeTel.trim() || undefined, headOfficeEmail: value.headOfficeEmail.trim() || undefined,
      isActive: value.isActive, customerGrade: value.grade as ApiCustomerGrade,
      customerType: value.type as ApiCustomerType, customerSegment: value.segment as ApiCustomerSegment,
      createdBy: userId(), companies: value.companies, salesmanId: Number(value.salesmanId),
    });
    setCustomers(previous => [created, ...previous]); setTransferInitialCustomerId(created.customerId); setCustomerCreateOpen(false);
    toast.success(`${created.customerName} created and selected`);
  };
  const createTransferSite = async (customerId: number, value: CustomerSiteFormValue) => {
    const created = await createCustomerSite({ site: { customerId, siteName: value.siteName, addressLine1: value.addressLine1, addressLine2: value.addressLine2 || null, addressLine3: value.addressLine3 || null, area: value.area, cityId: value.cityId, latitude: value.latitude, longitude: value.longitude, isHeadOffice: value.isHeadOffice, isActive: true }, contact: { contactName: value.contactName, mobileNumber: value.mobileNumber || null, email: value.email, designation: value.designation || null, isPrimary: true, isActive: true }, performedBy: userId() });
    toast.success(`${created.siteName} created and selected`); return created;
  };
  const importExcel = async (file?: File) => {
    if (!file) return;
    setImporting(true);
    try {
      const result = await importInitialMachines(file, userId());
      toast.success(`${result.importedMachines} machines imported · ${result.generatedVisits} visits generated · ${result.autoCompletedVisits} past visits completed`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to import initial machines.");
    } finally {
      setImporting(false);
    }
  };
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Machines</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {totalElements} machines. Search by reference, serial number or
            configured machine fields.
          </p>
        </div>
        <Button
          icon={<PlusIcon className="h-4 w-4" />}
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Create machine
        </Button>
      </div>
      <section className="mt-6 rounded-xl border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Initial machine Excel import</h2>
            <p className="mt-1 max-w-3xl text-sm text-ink-muted">Import existing machines with customer/site, invoice, main and service technicians, agreement and generated service visits. Past visits are completed automatically.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void downloadInitialMachineTemplate()}>
              <DownloadIcon className="mr-2 h-4 w-4" />Download template
            </Button>
            <label className={`inline-flex items-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white ${importing ? "cursor-wait opacity-60" : "cursor-pointer hover:bg-brand-800"}`}>
              <UploadIcon className="mr-2 h-4 w-4" />{importing ? "Importing…" : "Upload completed Excel"}
              <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={importing} className="hidden" onChange={(event) => { void importExcel(event.target.files?.[0]); event.currentTarget.value = ""; }} />
            </label>
          </div>
        </div>
      </section>
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="border-b border-line p-4">
          <div className="flex h-10 max-w-xl items-center rounded-lg border border-line focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
            <SearchIcon className="ml-3 h-4 w-4 text-ink-subtle" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
              placeholder="Search reference or serial number"
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="mr-2 p-1 text-ink-subtle"
                aria-label="Clear search"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <p className="px-6 py-16 text-center text-sm text-ink-muted">
            Loading machines…
          </p>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-danger-700">{error}</p>
            <Button
              variant="secondary"
              className="mt-5"
              onClick={() => void load()}
            >
              Try again
            </Button>
          </div>
        ) : machines.length ? (
          <MachinesTable
            machines={machines}
            onSelect={(m) => void openDetails(m)}
          />
        ) : (
          <div className="px-6 py-16 text-center">
            <SearchXIcon className="mx-auto h-8 w-8 text-ink-subtle" />
            <p className="mt-3 text-sm font-medium">No machines found</p>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-ink-muted">
          <span>{searching ? "Searching…" : `Showing ${machines.length} of ${totalElements} machines · Page ${page + 1} of ${Math.max(totalPages, 1)}`}</span>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous page" disabled={page === 0 || searching} onClick={() => setPage((current) => Math.max(0, current - 1))} className="rounded-lg border border-line p-2 disabled:opacity-40">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Next page" disabled={page + 1 >= totalPages || searching} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-line p-2 disabled:opacity-40">
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <MachineDrawer
        machine={selected}
        loading={detailLoading}
        error={detailError}
        deleting={deleting}
        onClose={() => {
          setSelected(null);
          setDetailError(null);
        }}
        onEdit={(m) => {
          setEditing(m);
          setDialogOpen(true);
        }}
        onDelete={(m) => void remove(m)}
        onChangeCustomer={(machine) => { setTransferInitialCustomerId(null); setCustomerTransferMachine(machine); }}
        onChangeTechnicians={setTechnicianChangeMachine}
        onReturn={setReturnMachine}
        onHistory={(machine) => void openHistory(machine)}
      />
      <CustomerTransferDialog key={`${customerTransferMachine?.machineId ?? "customer-closed"}-${transferInitialCustomerId ?? "none"}`} machine={customerTransferMachine} customers={customers} cities={cities} initialCustomerId={transferInitialCustomerId} onCreateCustomer={() => setCustomerCreateOpen(true)} onCreateSite={createTransferSite} onClose={() => { setCustomerTransferMachine(null); setTransferInitialCustomerId(null); }} onSave={changeCustomer} />
      <CreateCustomerDialog open={customerCreateOpen} onClose={() => setCustomerCreateOpen(false)} onCreate={createTransferCustomer} />
      <TechnicianChangeDialog key={technicianChangeMachine?.machineId ?? "technician-closed"} machine={technicianChangeMachine} technicians={technicians} onClose={() => setTechnicianChangeMachine(null)} onSave={changeTechnicians} />
      <ReturnToStockDialog key={returnMachine?.machineId ?? "return-closed"} machine={returnMachine} onClose={() => setReturnMachine(null)} onSave={returnToStock} />
      <MachineHistoryDialog machine={historyMachine} events={historyEvents} loading={historyLoading} onClose={() => setHistoryMachine(null)} />
      <MachineDialog
        open={dialogOpen}
        machine={editing}
        customers={customers}
        technicians={technicians}
        salesmen={salesmen}
        models={models}
        cities={cities}
        onCreateModel={() => setModelDialogOpen(true)}
        onCreateCity={() => setCityDialogOpen(true)}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSave={save}
      />
      <MachineModelDialog
        open={modelDialogOpen}
        model={null}
        onClose={() => setModelDialogOpen(false)}
        onSave={addModel}
      />
      <CityDialog
        open={cityDialogOpen}
        city={null}
        onClose={() => setCityDialogOpen(false)}
        onSave={addCity}
      />
    </div>
  );
}
