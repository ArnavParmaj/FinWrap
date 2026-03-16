import { useState, useMemo } from "react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { formatINR } from "../lib/dashboardStats";

function AddSubscriptionModal({ onClose, onSave }: { onClose: () => void; onSave: (sub: any) => Promise<void> }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [cycle, setCycle] = useState<"monthly" | "yearly" | "weekly">("monthly");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name) return setError("Please enter a subscription name.");
    if (!amount || parseFloat(amount) <= 0) return setError("Enter a valid amount.");
    if (!nextPaymentDate) return setError("Please select a valid next payment date.");

    setSaving(true);
    try {
      await onSave({
        name,
        amount: parseFloat(amount),
        category,
        cycle,
        nextPaymentDate,
        status: "active",
        isActive: true,
      });
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to save subscription.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-xl">
      <div className="glass-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Add Subscription</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500">Service Name</label>
            <input
              className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2"
              type="text"
              placeholder="Netflix, Spotify, Notion..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Amount (₹)</label>
              <input
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2"
                type="number"
                placeholder="649"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Cycle</label>
              <select
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-slate-200 px-3 py-2"
                value={cycle}
                onChange={(e) => setCycle(e.target.value as any)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Category</label>
              <select
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-slate-200 px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Software">Software</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Next Payment</label>
              <input
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-slate-200 px-3 py-2"
                type="date"
                value={nextPaymentDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-bold hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-[2] py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50">
            {saving ? "Saving..." : "Add Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecurringPage() {
  const { subscriptions, loading, addSubscription, updateSubscription } = useSubscriptions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const activeSubscriptions = useMemo(() => subscriptions.filter(s => s.isActive), [subscriptions]);
  const archivedSubscriptions = useMemo(() => subscriptions.filter(s => !s.isActive), [subscriptions]);
  const currentView = showArchived ? archivedSubscriptions : activeSubscriptions;

  // Monthly breakdown calculation
  const totalMonthlyProjected = useMemo(() => {
    return activeSubscriptions.reduce((acc, sub) => {
      if (sub.cycle === 'monthly') return acc + sub.amount;
      if (sub.cycle === 'yearly') return acc + (sub.amount / 12);
      if (sub.cycle === 'weekly') return acc + (sub.amount * 4);
      return acc;
    }, 0);
  }, [activeSubscriptions]);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto w-full">
        {/* Hero Stat Card */}
        <div className="glass-card p-10 rounded-[2rem] border-primary/20 bg-primary/5 relative overflow-hidden mb-12 shadow-2xl shadow-primary/10">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <span className="material-icons-outlined text-[120px] text-primary">currency_rupee</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-slate-400 font-medium uppercase tracking-widest text-xs">
                Monthly Recurring
              </span>
            </div>
            <h1 className="text-7xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
              {formatINR(totalMonthlyProjected)}
              <span className="text-2xl font-normal text-slate-500">/mo</span>
            </h1>
            <p className="mt-4 text-slate-400 max-w-md">
              Your projected expenses for the next 30 days based on active subscriptions and detected bills.
            </p>
          </div>
        </div>

        {/* Subscriptions List Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-bold">{showArchived ? "Archived Subscriptions" : "Active Subscriptions"}</h3>
          <div className="flex gap-2">
            <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all">
              <span className="material-icons-outlined text-sm">add</span>
              New Sub
            </button>
          </div>
        </div>

        {/* List of Cards */}
        <div className="space-y-4">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card h-24 rounded-2xl animate-pulse bg-white/5" />
            ))
          ) : currentView.length === 0 ? (
             <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
              <span className="material-icons-outlined text-5xl text-slate-600">event_repeat</span>
              <h3 className="text-lg font-semibold text-slate-300">No {showArchived ? "archived" : "active"} subscriptions</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Track your recurring expenses here. Click 'New Sub' to start tracking.
              </p>
            </div>
          ) : (
            currentView.map((sub) => (
              <div key={sub.id} className={`glass-card p-5 rounded-2xl flex items-center gap-6 group hover:border-primary/40 transition-all ${!sub.isActive ? "opacity-60 grayscale" : ""}`}>
                <div className="size-14 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300">
                  <span className="material-icons-outlined text-2xl">
                    {sub.category === "Entertainment" ? "movie" : sub.category === "Software" ? "laptop_mac" : "receipt_long"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg truncate text-slate-100">{sub.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {sub.category}
                    </span>
                    <span className={`flex items-center gap-1 ${sub.status === 'missing' ? 'text-rose-400 font-medium' : ''}`}>
                      <span className="material-icons-outlined text-sm">{sub.status === 'missing' ? 'error' : 'calendar_today'}</span> 
                      {sub.status === 'missing' ? 'Missing Payment' : `Next: ${new Date(sub.nextPaymentDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                <div className="text-right px-6">
                  <p className="text-xl font-bold text-white">{formatINR(sub.amount)}</p>
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full capitalize">
                    {sub.cycle}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-5">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                    sub.status === 'missing' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                    sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {sub.status}
                  </span>
                  
                  <button 
                    onClick={() => updateSubscription(sub.id, { isActive: !sub.isActive, status: !sub.isActive ? 'active' : 'cancelled' })}
                    className={`flex items-center justify-center size-8 rounded-full border transition-colors ${sub.isActive ? 'border-primary bg-primary text-white hover:bg-primary/80' : 'border-slate-600 bg-transparent text-slate-500 hover:border-slate-400'}`}
                    title={sub.isActive ? "Cancel Subscription" : "Restore Subscription"}
                  >
                     <span className="material-icons-outlined text-[16px]">
                       {sub.isActive ? 'close' : 'restore'}
                     </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Additional View Actions */}
        {(activeSubscriptions.length > 0 || archivedSubscriptions.length > 0) && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors py-4"
            >
              <span className="text-sm font-medium">
                {showArchived ? "View Active Subscriptions" : "View Archived Subscriptions"}
              </span>
              <span className="material-icons-outlined">expand_more</span>
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddSubscriptionModal onClose={() => setShowAddModal(false)} onSave={addSubscription as any} />
      )}
    </main>
  );
}
