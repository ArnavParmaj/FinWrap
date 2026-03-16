import { useState, useMemo, useRef } from "react";
import Papa from "papaparse";
import { useTransactions } from "../hooks/useTransactions";
import { useAppStore } from "../store/useAppStore";
import {
  formatMonthLabel,
  formatINR,
  getPrevMonth,
} from "../lib/dashboardStats";
import type { Transaction } from "../types";

// ── DEFAULT CATEGORIES ────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { id: "food", name: "Food & Drink", icon: "local_cafe", color: "#f59e0b" },
  { id: "shopping", name: "Shopping", icon: "shopping_cart", color: "#6366f1" },
  {
    id: "transport",
    name: "Transport",
    icon: "directions_car",
    color: "#22d3ee",
  },
  { id: "income", name: "Income", icon: "payments", color: "#10b981" },
  {
    id: "investment",
    name: "Investment",
    icon: "trending_up",
    color: "#a78bfa",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "movie",
    color: "#f43f5e",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "local_hospital",
    color: "#34d399",
  },
  { id: "utilities", name: "Utilities", icon: "bolt", color: "#fbbf24" },
  { id: "other", name: "Other", icon: "more_horiz", color: "#64748b" },
];

const getCategoryInfo = (catId: string) =>
  DEFAULT_CATEGORIES.find((c) => c.id === catId) ??
  DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1];

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
});

// suppress unused import warning
const _getPrevMonth = getPrevMonth;
void _getPrevMonth;

const PAGE_SIZE = 20;

// ── FORM ──────────────────────────────────────────────────────────────────────
interface TransactionFormData {
  date: string;
  merchant: string;
  categoryId: string;
  type: "debit" | "credit";
  amount: string;
  note: string;
}

const emptyForm = (): TransactionFormData => ({
  date: new Date().toISOString().slice(0, 10),
  merchant: "",
  categoryId: "other",
  type: "debit",
  amount: "",
  note: "",
});

interface AddModalProps {
  onClose: () => void;
  onSave: (
    data: Omit<
      Transaction,
      "id" | "createdAt" | "isRecurring" | "accountId" | "source"
    >,
  ) => Promise<void>;
  initial?: TransactionFormData;
}

function AddTransactionModal({ onClose, onSave, initial }: AddModalProps) {
  const [form, setForm] = useState<TransactionFormData>(initial ?? emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof TransactionFormData, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handle = async () => {
    if (!form.merchant.trim()) return setError("Merchant is required");
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) return setError("Enter a valid amount");
    setSaving(true);
    try {
      await onSave({
        date: form.date,
        merchant: form.merchant.trim(),
        categoryId: form.categoryId,
        type: form.type,
        amount: amt,
        note: form.note.trim(),
      });
      onClose();
    } catch (e: unknown) {
      setError((e as Error).message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="glass-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-100">
            {initial ? "Edit" : "Add"} Transaction
          </h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <span className="material-icons-outlined text-lg text-slate-400">
              close
            </span>
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          {(["debit", "credit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => set("type", t)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${
                form.type === t
                  ? t === "debit"
                    ? "bg-rose-500 text-white"
                    : "bg-emerald-500 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {t === "debit" ? "− Debit" : "+ Credit"}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 border border-white/10 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Merchant / Description
            </label>
            <input
              type="text"
              value={form.merchant}
              onChange={(e) => set("merchant", e.target.value)}
              placeholder="e.g. Swiggy, Amazon"
              className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 border border-white/10 focus:ring-1 focus:ring-primary outline-none placeholder:text-slate-600"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 border border-white/10 focus:ring-1 focus:ring-primary outline-none"
              style={{ colorScheme: "dark" }}
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  style={{ background: "#1e293b" }}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="0.00"
              className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 border border-white/10 focus:ring-1 focus:ring-primary outline-none placeholder:text-slate-600"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Note (optional)
            </label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Any note..."
              className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 border border-white/10 focus:ring-1 focus:ring-primary outline-none placeholder:text-slate-600"
            />
          </div>
        </div>
        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-white/5 text-slate-400 text-sm font-semibold hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/80 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CSV IMPORT MODAL ──────────────────────────────────────────────────────────
interface CsvModalProps {
  onClose: () => void;
  onImport: (rows: Omit<Transaction, "id" | "createdAt">[]) => Promise<void>;
}

function CsvImportModal({ onClose, onImport }: CsvModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Omit<Transaction, "id" | "createdAt">[]>([]);
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Parsing…");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[];
        const parsed = data.map(
          (row): Omit<Transaction, "id" | "createdAt"> => {
            const amount = Math.abs(
              parseFloat(row.amount ?? row.Amount ?? row.AMOUNT ?? "0"),
            );
            const rawType = (
              row.type ??
              row.Type ??
              row.TYPE ??
              ""
            ).toLowerCase();
            const type: "debit" | "credit" =
              rawType === "credit" ? "credit" : "debit";
            return {
              date: (
                row.date ??
                row.Date ??
                row.DATE ??
                new Date().toISOString().slice(0, 10)
              ).slice(0, 10),
              merchant:
                row.merchant ??
                row.Merchant ??
                row.description ??
                row.Description ??
                "Unknown",
              amount,
              type,
              categoryId: (row.category ?? row.Category ?? "other")
                .toLowerCase()
                .replace(/\s+/g, "_"),
              note: row.note ?? row.Note ?? "",
              isRecurring: false,
              accountId: "",
              source: "csv",
            };
          },
        );
        setRows(parsed);
        setStatus(`${parsed.length} rows ready to import`);
      },
      error: (err) => setStatus(`Error: ${err.message}`),
    });
  };

  const handleImport = async () => {
    if (!rows.length) return;
    setImporting(true);
    try {
      await onImport(rows);
      onClose();
    } catch (e: unknown) {
      setStatus(`Import failed: ${(e as Error).message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="glass-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-100">Import CSV</h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <span className="material-icons-outlined text-lg text-slate-400">
              close
            </span>
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Upload a CSV export from your bank. Expected columns:{" "}
          <code className="text-primary">
            date, merchant, amount, type, category
          </code>
        </p>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
        >
          <span className="material-icons-outlined text-4xl text-slate-500">
            upload_file
          </span>
          <p className="text-slate-400 text-sm">Click to select CSV file</p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="hidden"
          />
        </div>
        {status && (
          <p
            className={`mt-3 text-sm ${status.startsWith("Error") ? "text-rose-400" : "text-emerald-400"}`}
          >
            {status}
          </p>
        )}
        {rows.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto rounded-lg border border-white/10 text-xs">
            <table className="w-full">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Merchant</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2 text-center">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.slice(0, 10).map((r, i) => (
                  <tr key={i} className="text-slate-300">
                    <td className="px-3 py-1.5">{r.date}</td>
                    <td className="px-3 py-1.5">{r.merchant}</td>
                    <td className="px-3 py-1.5 text-right">
                      {formatINR(r.amount)}
                    </td>
                    <td
                      className={`px-3 py-1.5 text-center font-semibold ${r.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {r.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 10 && (
              <p className="px-3 py-2 text-slate-500">
                …and {rows.length - 10} more rows
              </p>
            )}
          </div>
        )}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-white/5 text-slate-400 text-sm font-semibold hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!rows.length || importing}
            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/80 disabled:opacity-40"
          >
            {importing ? "Importing…" : `Import ${rows.length} rows`}
          </button>
        </div>
      </div>
    </div>
  );
}

function RowMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 hover:text-primary transition-colors text-slate-400"
      >
        <span className="material-icons-outlined">more_horiz</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-6 z-50 glass-dropdown rounded-xl border border-white/10 shadow-xl py-1 w-32">
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 flex items-center gap-2"
            >
              <span className="material-icons-outlined text-sm">edit</span> Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
            >
              <span className="material-icons-outlined text-sm">delete</span>{" "}
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── DELETE CONFIRMATION MODAL ─────────────────────────────────────────────────
interface DeleteConfirmModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteConfirmModal({ transaction, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!transaction) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error("Failed to delete:", e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="glass-card rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
            <span className="material-icons-outlined text-rose-500 text-2xl">delete_forever</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Delete Transaction?</h3>
            <p className="text-sm text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background:
                  getCategoryInfo(transaction.categoryId).color + "20",
              }}
            >
              <span
                className="material-icons-outlined"
                style={{ color: getCategoryInfo(transaction.categoryId).color }}
              >
                {getCategoryInfo(transaction.categoryId).icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-100 truncate">
                {transaction.merchant}
              </p>
              <p className="text-xs text-slate-500">
                {transaction.type === "credit" ? "+" : "-"}
                {formatINR(transaction.amount)} · {transaction.date}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2 rounded-lg bg-white/5 text-slate-400 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <span className="material-icons-outlined text-sm animate-spin">refresh</span>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
type TypeFilter = "all" | "debit" | "credit";

export default function TransactionsPage() {
  const { activeMonth, setActiveMonth } = useAppStore();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [catFilter, setCatFilter] = useState("all");
  // The search bar is now in TopNav, so local search filter is disabled for now.
  const search = ""; 
  const [page, setPage] = useState(0);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleteTx, setDeleteTx] = useState<Transaction | null>(null);

  const { transactions, loading, addTransaction, removeTransaction, updateTransaction } =
    useTransactions(activeMonth);

  const filtered = useMemo(() => {
    let result = transactions;
    if (typeFilter !== "all")
      result = result.filter((t) => t.type === typeFilter);
    if (catFilter !== "all")
      result = result.filter((t) => t.categoryId === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.note?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [transactions, typeFilter, catFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const resetPage = () => setPage(0);

  const handleAdd = async (
    data: Omit<
      Transaction,
      "id" | "createdAt" | "isRecurring" | "accountId" | "source"
    >,
  ) => {
    await addTransaction({
      ...data,
      isRecurring: false,
      accountId: "",
      source: "manual",
    });
  };

  const handleEdit = async (
    data: Omit<
      Transaction,
      "id" | "createdAt" | "isRecurring" | "accountId" | "source"
    >,
  ) => {
    if (!editTx) return;
    await updateTransaction(editTx.id, {
      ...data,
      isRecurring: editTx.isRecurring,
      accountId: editTx.accountId,
      source: editTx.source,
    });
  };

  const handleCsvImport = async (
    rows: Omit<Transaction, "id" | "createdAt">[],
  ) => {
    for (const row of rows) await addTransaction(row);
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {showAddModal && (
        <AddTransactionModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      )}
      {editTx && (
        <AddTransactionModal
          onClose={() => setEditTx(null)}
          onSave={handleEdit}
          initial={{
            date: editTx.date,
            merchant: editTx.merchant,
            categoryId: editTx.categoryId,
            type: editTx.type,
            amount: String(editTx.amount),
            note: editTx.note ?? "",
          }}
        />
      )}
      {showCsvModal && (
        <CsvImportModal
          onClose={() => setShowCsvModal(false)}
          onImport={handleCsvImport}
        />
      )}
      {deleteTx && (
        <DeleteConfirmModal
          transaction={deleteTx}
          onClose={() => setDeleteTx(null)}
          onConfirm={async () => {
            await removeTransaction(deleteTx.id);
          }}
        />
      )}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ── Page Header — OUTSIDE scroll, so dropdowns aren't clipped ── */}
        <div className="px-8 pt-8 pb-4 flex-shrink-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Transactions
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage and track your financial movements
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCsvModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-bold transition-all"
            >
              <span className="material-icons-outlined text-[18px]">
                upload_file
              </span>
              Import CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all"
            >
              <span className="material-icons-outlined text-[18px]">add</span>
              Add Transaction
            </button>
          </div>
        </div>

        {/* ── Filter Bar — OUTSIDE scroll so dropdowns always render on top ── */}
        <div className="relative z-20 px-8 pb-4 flex-shrink-0">
          <div className="glass-card rounded-2xl p-2 flex flex-wrap items-center gap-2">
            {/* Month picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMonthPicker((v) => !v);
                  setShowCatPicker(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors text-sm font-medium text-slate-300"
              >
                <span className="material-icons-outlined text-[18px] text-primary">
                  calendar_month
                </span>
                {formatMonthLabel(activeMonth)}
                <span className="material-icons-outlined text-[18px]">
                  expand_more
                </span>
              </button>
              {showMonthPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMonthPicker(false)}
                  />
                  <div className="absolute top-11 left-0 glass-dropdown rounded-xl border border-white/10 z-50 w-48 py-1 shadow-2xl max-h-64 overflow-y-auto">
                    {MONTHS.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setActiveMonth(m);
                          setShowMonthPicker(false);
                          resetPage();
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${m === activeMonth ? "text-primary font-semibold" : "text-slate-300"}`}
                      >
                        {formatMonthLabel(m)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-primary/10 mx-1" />

            {/* Category picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCatPicker((v) => !v);
                  setShowMonthPicker(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors text-sm font-medium text-slate-300"
              >
                <span className="material-icons-outlined text-[18px] text-primary">
                  category
                </span>
                {catFilter === "all"
                  ? "All Categories"
                  : (DEFAULT_CATEGORIES.find((c) => c.id === catFilter)?.name ??
                    catFilter)}
                <span className="material-icons-outlined text-[18px]">
                  expand_more
                </span>
              </button>
              {showCatPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCatPicker(false)}
                  />
                  <div className="absolute top-11 left-0 glass-dropdown rounded-xl border border-white/10 z-50 w-52 py-1 shadow-2xl max-h-64 overflow-y-auto">
                    <button
                      onClick={() => {
                        setCatFilter("all");
                        setShowCatPicker(false);
                        resetPage();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${catFilter === "all" ? "text-primary font-semibold" : "text-slate-300"}`}
                    >
                      All Categories
                    </button>
                    {DEFAULT_CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCatFilter(c.id);
                          setShowCatPicker(false);
                          resetPage();
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2 ${catFilter === c.id ? "text-primary font-semibold" : "text-slate-300"}`}
                      >
                        <span
                          className="material-icons-outlined text-sm"
                          style={{ color: c.color }}
                        >
                          {c.icon}
                        </span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-primary/10 mx-1" />

            {/* Type filter */}
            <div className="bg-primary/5 rounded-xl p-1 flex gap-1">
              {(["all", "debit", "credit"] as TypeFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTypeFilter(t);
                    resetPage();
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${typeFilter === t ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:bg-primary/10"}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex-1 flex justify-end px-2">
              <p className="text-slate-500 text-xs">
                {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* ── Table — inside scroll container ── */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="glass-card rounded-3xl overflow-hidden border border-primary/10 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Merchant</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-4 bg-white/5 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-500">
                        <span className="material-icons-outlined text-4xl">
                          search_off
                        </span>
                        <p className="text-sm font-medium">
                          No transactions found
                        </p>
                        <p className="text-xs">
                          Try a different filter or add transactions
                        </p>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="mt-2 px-4 py-2 bg-primary rounded-lg text-sm font-semibold text-white hover:bg-primary/80"
                        >
                          Add Transaction
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((tx) => {
                    const cat = getCategoryInfo(tx.categoryId);
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-300">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="size-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: cat.color + "20" }}
                            >
                              <span
                                className="material-icons-outlined text-[18px]"
                                style={{ color: cat.color }}
                              >
                                {cat.icon}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-100">
                                {tx.merchant}
                              </p>
                              {tx.note && (
                                <p className="text-xs text-slate-500">
                                  {tx.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                            style={{
                              background: cat.color + "20",
                              color: cat.color,
                              borderColor: cat.color + "40",
                            }}
                          >
                            {cat.name}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 text-right text-sm font-bold ${tx.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}
                        >
                          {tx.type === "credit" ? "+" : "-"}
                          {formatINR(tx.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <RowMenu
                            onEdit={() => setEditTx(tx)}
                            onDelete={() => setDeleteTx(tx)}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="p-5 flex items-center justify-between text-sm text-slate-500 border-t border-primary/5">
              <p>
                Showing{" "}
                <span className="font-bold text-slate-200">
                  {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}–
                  {Math.min((page + 1) * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-200">
                  {filtered.length}
                </span>{" "}
                transactions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/5 disabled:opacity-40 text-slate-300 text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/5 disabled:opacity-40 text-slate-300 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
