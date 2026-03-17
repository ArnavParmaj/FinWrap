import { useState, useMemo } from "react";
import { useGoals } from "../hooks/useGoals";
import { formatINR } from "../lib/dashboardStats";
import type { Goal } from "../types";

const GOAL_TEMPLATES = [
  { id: "travel", name: "Travel", icon: "flight", color: "#6366f1" },
  { id: "vehicle", name: "Vehicle", icon: "directions_car", color: "#f59e0b" },
  { id: "emergency", name: "Emergency", icon: "health_and_safety", color: "#10b981" },
  { id: "gadget", name: "Gadget", icon: "devices", color: "#3b82f6" },
  { id: "home", name: "Home", icon: "home", color: "#8b5cf6" },
  { id: "other", name: "Custom", icon: "star", color: "#ec4899" }
];

function AddGoalModal({ onClose, onSave }: { onClose: () => void; onSave: (goal: any) => Promise<void> }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [templateId, setTemplateId] = useState(GOAL_TEMPLATES[0].id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedTemplate = GOAL_TEMPLATES.find((t) => t.id === templateId)!;

  const handleSave = async () => {
    if (!name) return setError("Please enter a goal name");
    if (!targetAmount || parseFloat(targetAmount) <= 0) return setError("Valid target amount required");
    if (!targetDate) return setError("Please select a target date");

    setSaving(true);
    try {
      await onSave({
        name,
        targetAmount: parseFloat(targetAmount),
        savedAmount: savedAmount ? parseFloat(savedAmount) : 0,
        targetDate,
        icon: selectedTemplate.icon,
        color: selectedTemplate.color,
      });
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to save goal");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 items-center justify-center p-4 bg-background-dark/80 backdrop-blur-xl flex">
      <div className="glass-card w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Create New Savings Goal</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    templateId === t.id ? "bg-primary text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span className="material-icons-outlined text-sm" style={{ color: templateId === t.id ? "white" : t.color }}>{t.icon}</span>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Goal Name</label>
              <input
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2"
                type="text"
                placeholder="Dream Vacation"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Target Amount (₹)</label>
              <input
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2"
                type="number"
                placeholder="150000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Initial Deposit (₹)</label>
              <input
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2"
                type="number"
                placeholder="0"
                value={savedAmount}
                onChange={(e) => setSavedAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Target Date</label>
              <input
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-slate-200 px-3 py-2"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
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
            {saving ? "Saving..." : "Confirm Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddContributionModal({ goal, onClose, onSave }: { goal: Goal, onClose: () => void, onSave: (id: string, newAmount: number, currentSaved: number) => Promise<void> }) {
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setSaving(true);
    await onSave(goal.id, parseFloat(amount), goal.savedAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 items-center justify-center p-4 bg-background-dark/80 backdrop-blur-xl flex">
      <div className="glass-card w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Add Contribution</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300">Adding to <strong>{goal.name}</strong></p>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500">Amount (₹)</label>
            <input
              className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2"
              type="number"
              placeholder="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-bold hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-[2] py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all disabled:opacity-50">
            {saving ? "Adding..." : "Add Funds"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalDetailsModal({ 
  goal, 
  onClose, 
  onContribute, 
  onDelete, 
  onArchive, 
  onUnarchive 
}: { 
  goal: Goal; 
  onClose: () => void; 
  onContribute: () => void; 
  onDelete: (id: string) => Promise<void>;
  onArchive?: () => void;
  onUnarchive?: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const isCompleted = goal.savedAmount >= goal.targetAmount;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(goal.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 items-center justify-center p-4 bg-background-dark/80 backdrop-blur-xl flex">
      <div className="glass-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5" style={{ color: goal.color }}>
              <span className="material-icons-outlined">{goal.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{goal.name}</h3>
              <p className="text-sm text-slate-400">Target: {formatINR(goal.targetAmount)} • Due {new Date(goal.targetDate).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-white text-lg">
                {formatINR(goal.savedAmount)} <span className="text-slate-500 text-sm font-normal">saved</span>
              </span>
              <span className="text-slate-400 font-medium">{Math.round(percent)}% reached</span>
            </div>
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div className="h-full progress-glow rounded-full transition-all duration-1000" style={{ width: `${percent}%`, backgroundColor: goal.color }}></div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-3">
             {!isCompleted && !goal.isArchived && (
              <button onClick={onContribute} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                <span className="material-icons-outlined text-[18px]">add</span>
                Add Contribution
              </button>
            )}
            {!goal.isArchived && !isCompleted && onArchive && (
               <button onClick={onArchive} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 text-sm font-bold hover:bg-white/10 transition-all">
                <span className="material-icons-outlined text-[18px]">archive</span>
                Archive
              </button>
            )}
            {goal.isArchived && onUnarchive && (
               <button onClick={onUnarchive} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 text-sm font-bold hover:bg-white/10 transition-all">
                <span className="material-icons-outlined text-[18px]">unarchive</span>
                Unarchive
              </button>
            )}
          </div>

          {/* Contribution History */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Contribution History</h4>
            {(!goal.contributions || goal.contributions.length === 0) ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-slate-700">
                <p className="text-slate-500 text-sm">No recorded contributions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goal.contributions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <span className="material-icons-outlined text-sm">south_west</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">Deposit</p>
                        <p className="text-xs text-slate-400">{new Date(c.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400">+{formatINR(c.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer / Danger Zone */}
        <div className="p-6 border-t border-slate-800 bg-background-dark/50 flex-shrink-0">
          {showDeleteConfirm ? (
            <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
              <p className="text-sm text-rose-400 font-medium">Are you sure? This action is permanent.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 transition-colors font-medium">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50">
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-rose-500 text-sm font-medium hover:text-rose-400 transition-colors">
              <span className="material-icons-outlined text-[18px]">delete</span>
              Delete Goal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GoalCard({ goal, onClick }: { goal: Goal, onClick: () => void }) {
  const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const isCompleted = goal.savedAmount >= goal.targetAmount;
  
  // Calculate months remaining
  const now = new Date();
  const target = new Date(goal.targetDate);
  const monthsRemaining = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  const remainingAmount = goal.targetAmount - goal.savedAmount;
  const monthlyPace = monthsRemaining > 0 ? remainingAmount / monthsRemaining : remainingAmount;

  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden group cursor-pointer hover:border-slate-600 transition-colors"
    >
      <div className="absolute top-0 left-0 w-full h-1 opacity-50" style={{ background: `linear-gradient(to right, ${goal.color}, transparent)` }}></div>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5" style={{ color: goal.color }}>
            <span className="material-icons-outlined">{goal.icon}</span>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-1">{goal.name}</h4>
            <p className="text-sm text-slate-400">
              Target: <span className="text-slate-200">{formatINR(goal.targetAmount)}</span>
            </p>
          </div>
        </div>
        {isCompleted ? (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
            Completed
          </span>
        ) : goal.isArchived ? (
           <span className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-500/20">
            Archived
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
            Active
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-300">
            {formatINR(goal.savedAmount)} saved
          </span>
          <span className="text-slate-500">{Math.round(percent)}% reached</span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div className="h-full bg-primary progress-glow rounded-full transition-all duration-1000" style={{ width: `${percent}%`, backgroundColor: goal.color }}></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-4">
          {!isCompleted && !goal.isArchived ? (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Monthly Pace</span>
                <span className="text-sm font-semibold text-slate-200">{formatINR(Math.max(monthlyPace, 0))}/mo</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Deadline</span>
                <span className="text-sm font-semibold text-slate-200">{new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 font-bold">Final Status</span>
              <span className="text-sm font-semibold text-emerald-400">{isCompleted ? "Goal Achieved!" : "Archived"}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-primary font-medium text-sm transition-opacity opacity-0 group-hover:opacity-100 hidden md:flex">
          View Details
          <span className="material-icons-outlined text-sm">arrow_forward</span>
        </div>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { goals, loading, addGoal, updateGoal, deleteGoal, addContribution } = useGoals();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'archived'>('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [contributionGoal, setContributionGoal] = useState<Goal | null>(null);

  const filteredGoals = useMemo(() => {
    return goals.filter(g => {
      const isCompleted = g.savedAmount >= g.targetAmount;
      if (activeTab === 'archived') return g.isArchived;
      if (activeTab === 'completed') return isCompleted && !g.isArchived;
      if (activeTab === 'active') return !isCompleted && !g.isArchived;
      return true;
    });
  }, [goals, activeTab]);

  const activeCount = goals.filter(g => g.savedAmount < g.targetAmount && !g.isArchived).length;
  const completedCount = goals.filter(g => g.savedAmount >= g.targetAmount && !g.isArchived).length;
  const archivedCount = goals.filter(g => g.isArchived).length;
  
  const totalSavedAcrossGoals = useMemo(() => goals.reduce((sum, g) => sum + g.savedAmount, 0), [goals]);

  return (
    <>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {/* Hero Stats */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h3 className="text-3xl font-black tracking-tight mb-2 text-white">Your Milestones</h3>
              <p className="text-slate-400">
                You currently have <strong className="text-slate-200">{activeCount} active target(s)</strong> and have saved <strong className="text-emerald-400">{formatINR(totalSavedAcrossGoals)}</strong> towards all your goals!
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              <span className="material-icons-outlined text-lg">add_circle</span>
              Create New Goal
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-6 border-b border-white/10 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`pb-4 px-2 border-b-2 text-sm whitespace-nowrap font-bold transition-colors ${
                activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Active Goals ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-4 px-2 border-b-2 text-sm whitespace-nowrap font-bold transition-colors ${
                activeTab === 'completed' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`pb-4 px-2 border-b-2 text-sm whitespace-nowrap font-bold transition-colors ${
                activeTab === 'archived' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Archived ({archivedCount})
            </button>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 h-48 animate-pulse bg-white/5" />
              ))
            ) : filteredGoals.length === 0 ? (
               <div className="col-span-full glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
                <span className="material-icons-outlined text-5xl text-slate-600">flag</span>
                <h3 className="text-lg font-semibold text-slate-300">No {activeTab} goals found</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  {activeTab === 'active' ? "You don't have any active milestones to track. Start a new savings goal!" : "Nothing to show here yet."}
                </p>
              </div>
            ) : (
              filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onClick={() => setSelectedGoal(goal)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddGoalModal
          onClose={() => setShowAddModal(false)}
          onSave={addGoal as any}
        />
      )}

      {selectedGoal && (
        <GoalDetailsModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onContribute={() => setContributionGoal(selectedGoal)}
          onDelete={deleteGoal}
          onArchive={() => updateGoal(selectedGoal.id, { isArchived: true })}
          onUnarchive={() => updateGoal(selectedGoal.id, { isArchived: false })}
        />
      )}

      {contributionGoal && (
        <AddContributionModal
          goal={contributionGoal}
          onClose={() => setContributionGoal(null)}
          onSave={addContribution}
        />
      )}
    </>
  );
}
