import { useState, useMemo } from "react";
import { useBudgets } from "../hooks/useBudgets";
import { useAppStore } from "../store/useAppStore";
import { useUserStore } from "../store/useUserStore";
import { formatINR, formatMonthLabel } from "../lib/dashboardStats";
import type { Budget } from "../types";

// Default categories for budget creation
const DEFAULT_CATEGORIES = [
  { id: "food", name: "Food & Drink", icon: "restaurant", color: "#f59e0b" },
  { id: "shopping", name: "Shopping", icon: "shopping_cart", color: "#6366f1" },
  { id: "transport", name: "Transport", icon: "directions_car", color: "#22d3ee" },
  { id: "entertainment", name: "Entertainment", icon: "movie", color: "#f43f5e" },
  { id: "healthcare", name: "Healthcare", icon: "local_hospital", color: "#34d399" },
  { id: "utilities", name: "Utilities", icon: "bolt", color: "#fbbf24" },
  { id: "travel", name: "Travel", icon: "flight", color: "#f43f5e" },
  { id: "subscriptions", name: "Subscriptions", icon: "calendar_today", color: "#0ea5e9" },
  { id: "wellness", name: "Health & Wellness", icon: "fitness_center", color: "#10b981" },
  { id: "other", name: "Other", icon: "more_horiz", color: "#64748b" },
];

interface AddBudgetModalProps {
  onClose: () => void;
  onSave: (budget: Omit<Budget, "id" | "createdAt" | "spent" | "userId">) => Promise<void>;
  month: string;
}

function AddBudgetModal({ onClose, onSave, month }: AddBudgetModalProps) {
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [rollover, setRollover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = DEFAULT_CATEGORIES.find((c) => c.id === categoryId);

  const handleSave = async () => {
    if (!categoryId) return setError("Please select a category");
    if (!amount || parseFloat(amount) <= 0) return setError("Enter a valid amount");
    if (!selectedCategory) return setError("Invalid category");

    setSaving(true);
    try {
      await onSave({
        categoryId,
        categoryName: selectedCategory.name,
        categoryIcon: selectedCategory.icon,
        categoryColor: selectedCategory.color,
        amount: parseFloat(amount),
        month,
        rollover,
      });
      onClose();
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to save budget");
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
          <h3 className="text-lg font-bold text-slate-100">Add Budget</h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <span className="material-icons-outlined text-lg text-slate-400">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {DEFAULT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    categoryId === cat.id
                      ? "bg-primary text-white"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span className="material-icons-outlined text-sm" style={{ color: categoryId === cat.id ? "white" : cat.color }}>
                    {cat.icon}
                  </span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Budget Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="3000"
              className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 border border-white/10 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="rollover"
              checked={rollover}
              onChange={(e) => setRollover(e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
            />
            <label htmlFor="rollover" className="text-sm text-slate-300">
              Enable rollover (unused budget carries to next month)
            </label>
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-white/5 text-slate-400 text-sm font-semibold hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/80 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BudgetCard({ budget }: { budget: Budget }) {
  const percentUsed = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
  const remaining = budget.amount - budget.spent;
  const isOverBudget = remaining < 0;
  const isNearLimit = percentUsed >= 80 && !isOverBudget;

  // Determine colors based on budget status
  const getProgressColor = () => {
    if (isOverBudget) return "bg-rose-500";
    if (isNearLimit) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getRemainingColor = () => {
    if (isOverBudget) return "text-rose-400";
    if (isNearLimit) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div
      className={`glass-card rounded-2xl p-6 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300 ${
        isOverBudget ? "border border-rose-500/40" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: budget.categoryColor + "20", color: budget.categoryColor }}
        >
          <span className="material-icons-outlined text-3xl">{budget.categoryIcon}</span>
        </div>
        {budget.rollover && (
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Rollover On
          </span>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-100 mb-1">{budget.categoryName}</h3>
        <p className={`text-2xl font-black ${getRemainingColor()}`}>
          {isOverBudget ? `-${formatINR(Math.abs(remaining))}` : `${formatINR(remaining)} left`}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>{formatINR(budget.spent)} spent</span>
          <span>{formatINR(budget.amount)} budget</span>
        </div>
        <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>

      <div className="pt-2">
        <p className="text-xs text-slate-400">
          {formatINR(budget.spent)} spent of {formatINR(budget.amount)} ({Math.round(percentUsed)}%)
        </p>
      </div>
    </div>
  );
}

// Generate last 12 months for selector
const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
});

export default function BudgetsPage() {
  const { user } = useUserStore();
  const { activeMonth, setActiveMonth } = useAppStore();
  const { budgets, loading, addBudget } = useBudgets(activeMonth);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const totalBudget = useMemo(() => budgets.reduce((sum, b) => sum + b.amount, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((sum, b) => sum + b.spent, 0), [budgets]);
  const totalRemaining = totalBudget - totalSpent;

  const handleAddBudget = async (
    data: Omit<Budget, "id" | "createdAt" | "spent" | "userId">
  ) => {
    await addBudget({ ...data, userId: user?.uid || "" });
  };

  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 glass-card sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              className="w-full bg-slate-100 dark:bg-slate-900/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-500"
              placeholder="Search budgets or categories..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
            <span className="material-icons-outlined">notifications</span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-sm font-bold text-slate-200">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <span className="text-sm font-semibold">{user?.name ?? "User"}</span>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-100 dark:text-white">
              Budget Goals
            </h2>
            <p className="text-slate-500 mt-1">Manage your monthly spending limits and savings.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 transition-all"
          >
            <span className="material-icons-outlined">add</span>
            Add Budget
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto relative">
          <button
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            className="px-2 py-4 text-sm font-bold text-primary border-b-2 border-primary whitespace-nowrap flex items-center gap-1"
          >
            {formatMonthLabel(activeMonth)}
            <span className="material-icons-outlined text-sm">expand_more</span>
          </button>

          {showMonthPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMonthPicker(false)} />
              <div className="absolute top-14 left-8 glass-dropdown rounded-xl border border-white/10 z-50 w-48 py-1 shadow-2xl max-h-64 overflow-y-auto">
                {MONTHS.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setActiveMonth(m);
                      setShowMonthPicker(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${
                      m === activeMonth ? "text-primary font-semibold" : "text-slate-300"
                    }`}
                  >
                    {formatMonthLabel(m)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Budget Summary */}
      {budgets.length > 0 && (
        <div className="px-8 pb-6">
          <div className="glass-card rounded-2xl p-6 border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-icons-outlined text-3xl">account_balance_wallet</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-bold text-lg">Monthly Budget Overview</h4>
              <p className="text-slate-500 text-sm">
                {formatMonthLabel(activeMonth)}: {formatINR(totalSpent)} spent of {formatINR(totalBudget)} budget
              </p>
            </div>
            <div className="flex gap-8 text-center">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Total Budget</p>
                <p className="text-xl font-black text-slate-100">{formatINR(totalBudget)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Spent</p>
                <p className="text-xl font-black text-rose-400">{formatINR(totalSpent)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Remaining</p>
                <p className={`text-xl font-black ${totalRemaining >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {formatINR(totalRemaining)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-64 animate-pulse bg-white/5" />
          ))
        ) : budgets.length === 0 ? (
          // Empty state
          <div className="col-span-full glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
            <span className="material-icons-outlined text-5xl text-slate-600">account_balance_wallet</span>
            <h3 className="text-lg font-semibold text-slate-300">No budgets yet</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              Create your first budget to start tracking your spending and saving goals.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-5 py-2 bg-primary rounded-lg text-sm font-semibold hover:bg-primary/80 transition-colors"
            >
              Add Budget
            </button>
          </div>
        ) : (
          // Budget cards
          budgets.map((budget) => <BudgetCard key={budget.id} budget={budget} />)
        )}
      </div>

      {/* Footer info */}
      {budgets.length > 0 && (
        <div className="px-8 pb-12">
          <div className="glass-card rounded-2xl p-6 border-primary/20 bg-primary/5 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-icons-outlined text-3xl">info</span>
            </div>
            <div>
              <h4 className="font-bold text-lg">Budget Tips</h4>
              <p className="text-slate-500 text-sm">
                Enable rollover to carry unused budget to the next month. Categories over 80% spent are highlighted in amber, over budget in red.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddModal && (
        <AddBudgetModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddBudget}
          month={activeMonth}
        />
      )}
    </main>
  );
}
