import { useState, useMemo } from "react";
import { useSplits } from "../hooks/useSplits";
import { useTransactions } from "../hooks/useTransactions";
import { formatINR } from "../lib/dashboardStats";
import type { SplitGroup } from "../types";

export default function SplitsPage() {
  const { groups, expenses, settlements, addGroup, addExpense, addSettlement } = useSplits();
  const { addTransaction } = useTransactions();
  
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId) || groups[0], [groups, activeGroupId]);

  // Handle active group selection if none selected but groups exist
  if (!activeGroupId && groups.length > 0) setActiveGroupId(groups[0].id);

  // Balances calculation for the active group
  const groupExpenses = useMemo(() => expenses.filter(e => e.groupId === activeGroup?.id), [expenses, activeGroup]);
  const groupSettlements = useMemo(() => settlements.filter(s => s.groupId === activeGroup?.id), [settlements, activeGroup]);

  const balances = useMemo(() => {
    if (!activeGroup) return {};
    const members = ['You', ...activeGroup.members.map(m => m.name)];
    const bals: Record<string, number> = {};
    members.forEach(m => bals[m] = 0);

    groupExpenses.forEach(exp => {
      const share = exp.totalAmount / members.length;
      members.forEach(m => bals[m] -= share);
      if (bals[exp.paidBy] !== undefined) {
        bals[exp.paidBy] += exp.totalAmount;
      }
    });

    groupSettlements.forEach(settle => {
      if (bals[settle.from] !== undefined) bals[settle.from] += settle.amount;
      if (bals[settle.to] !== undefined) bals[settle.to] -= settle.amount;
    });

    return bals;
  }, [activeGroup, groupExpenses, groupSettlements]);

  const myBalance = balances['You'] || 0;
  const isOwed = myBalance > 0;
  const iOwe = myBalance < 0;

  const handleSettleUp = async (memberName: string, amount: number, direction: 'i_owe' | 'they_owe') => {
    if (!activeGroup) return;
    
    // Create settlement
    const from = direction === 'i_owe' ? 'You' : memberName;
    const to = direction === 'i_owe' ? memberName : 'You';
    
    await addSettlement({
      groupId: activeGroup.id,
      from,
      to,
      amount,
      date: new Date().toISOString().split('T')[0]
    });

    // Mirror to transactions to maintain dashboard integrity
    if (direction === 'i_owe') {
      // You paid someone back -> debit
      await addTransaction({
        amount,
        type: 'debit',
        categoryId: 'splits',
        merchant: `Settled up with ${memberName}`,
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
        accountId: 'default',
        source: 'manual'
      });
    } else {
      // Someone paid you back -> credit
      await addTransaction({
        amount,
        type: 'credit',
        categoryId: 'splits',
        merchant: `${memberName} paid you back`,
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
        accountId: 'default',
        source: 'manual'
      });
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden relative aurora-glow">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[320px] border-r border-white/5 flex flex-col p-6 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-100">Your Groups</h3>
            <button className="material-icons-outlined text-slate-400 hover:text-white transition-colors">
              filter_list
            </button>
          </div>
          <button 
            onClick={() => setShowAddGroup(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm mb-6 transition-all shadow-lg shadow-primary/10"
          >
            <span className="material-icons-outlined text-lg">add_circle</span>
            New Group
          </button>
          
          <div className="space-y-3">
            {groups.length === 0 ? (
              <div className="text-center p-4 text-slate-500 text-sm">No groups yet.</div>
            ) : (
              groups.map(g => (
                <div 
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className={`glass-panel p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors border-l-4 ${g.id === activeGroupId ? 'border-primary bg-white/5' : 'border-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-100">{g.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      {g.members.length + 1} members
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex -space-x-2">
                       <div className="size-7 rounded-full border-2 border-[#080A0F] bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                        You
                      </div>
                      {g.members.slice(0, 3).map((m, i) => (
                        <div key={i} className="size-7 rounded-full border-2 border-[#080A0F] bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {m.name.charAt(0)}
                        </div>
                      ))}
                      {g.members.length > 3 && (
                        <div className="size-7 rounded-full border-2 border-[#080A0F] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                          +{g.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 flex flex-col p-8 overflow-y-auto bg-background-dark/50 overflow-x-hidden">
          {!activeGroup ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-500">
               <span className="material-icons-outlined text-6xl mb-4 opacity-20">group</span>
               <h2 className="text-xl font-bold">No Active Group</h2>
               <p className="mt-2 text-sm max-w-sm text-center">Create a group from the sidebar to start splitting expenses with friends.</p>
             </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">
                      {activeGroup.name}
                    </h1>
                    <span className="material-icons-outlined text-slate-500 cursor-pointer hover:text-white transition-colors">settings</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {activeGroup.description || `${activeGroup.members.length + 1} members`}
                  </p>
                </div>
                <div className="flex gap-4 shrink-0">
                  <button onClick={() => setShowAddExpense(true)} className="bg-primary hover:bg-primary/90 text-white rounded-lg h-11 px-6 flex items-center gap-2 font-bold transition-all whitespace-nowrap">
                    <span className="material-icons-outlined">receipt_long</span>
                    Add Expense
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 shrink-0">
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <span className="material-icons-outlined text-3xl">trending_up</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-400 truncate">Total Owed to You</p>
                    <p className="text-2xl font-black text-emerald-400">{formatINR(isOwed ? myBalance : 0)}</p>
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                    <span className="material-icons-outlined text-3xl">trending_down</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-400 truncate">Total You Owe</p>
                    <p className="text-2xl font-black text-rose-400">{formatINR(iOwe ? Math.abs(myBalance) : 0)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-10 shrink-0">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="material-icons-outlined text-primary">history</span>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {groupExpenses.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 glass-panel rounded-xl">No expenses recorded yet.</div>
                  ) : (
                    groupExpenses.map(exp => {
                      const share = exp.totalAmount / (activeGroup.members.length + 1);
                      let oweStatus = "";
                      let oweAmount = "";
                      let colorClass = "";
                      
                      if (exp.paidBy === 'You') {
                        oweStatus = "You lent";
                        oweAmount = formatINR(exp.totalAmount - share);
                        colorClass = "text-emerald-400";
                      } else {
                        oweStatus = "You borrowed";
                        oweAmount = formatINR(share);
                        colorClass = "text-rose-400";
                      }

                      return (
                        <div key={exp.id} className="glass-panel p-4 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all group overflow-x-auto relative">
                          <div className="flex items-center gap-4 shrink-0 pr-4">
                            <div className="size-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <span className="material-icons-outlined text-slate-400">receipt</span>
                            </div>
                            <div className="min-w-[120px]">
                              <h5 className="font-bold text-slate-100 group-hover:text-primary transition-colors truncate max-w-[200px]">
                                {exp.description}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                  Paid by {exp.paidBy}
                                </span>
                                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap">
                                  {exp.splitEqually ? 'Split equally' : 'Custom'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-8 shrink-0">
                            <div className="min-w-[80px]">
                              <p className="text-xs text-slate-500">Total amount</p>
                              <p className="text-lg font-bold text-slate-100">{formatINR(exp.totalAmount)}</p>
                            </div>
                            <div className="min-w-[80px]">
                              <p className="text-xs text-slate-500">{oweStatus}</p>
                              <p className={`text-lg font-bold ${colorClass}`}>{oweAmount}</p>
                            </div>
                            <button className="material-icons-outlined text-slate-600 hover:text-white transition-colors shrink-0">
                              more_vert
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 shrink-0">
                <h3 className="text-lg font-bold text-white mb-6">Group Balances</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeGroup.members.map((m, idx) => {
                    const b = balances[m.name] || 0;
                    if (b === 0) return (
                      <div key={idx} className="glass-panel p-4 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3 min-w-0">
                           <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 shrink-0">{m.name.charAt(0)}</div>
                           <div className="min-w-0 pr-4">
                             <p className="text-sm font-bold truncate">{m.name}</p>
                             <p className="text-xs text-slate-500 truncate">Settled up</p>
                           </div>
                         </div>
                      </div>
                    );
                    
                    const MathAbsB = Math.abs(b);
                    // Approximation logic for star topology vs exact graph logic.
                    // Assuming user settles all debts directly
                    const isOwingMe = b < 0; // if their balance is negative, they owe money
                    
                    return (
                      <div key={idx} className="glass-panel p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">{m.name.charAt(0)}</div>
                          <div className="min-w-0 pr-4">
                            <p className="text-sm font-bold truncate">{m.name}</p>
                            <p className={`text-xs truncate ${isOwingMe ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isOwingMe ? `Owes you ${formatINR(MathAbsB)}` : `You owe them ${formatINR(MathAbsB)}`}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSettleUp(m.name, MathAbsB, isOwingMe ? 'they_owe' : 'i_owe')}
                          className="text-primary hover:bg-primary/10 border border-primary/30 rounded-lg px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0"
                        >
                          {isOwingMe ? 'Remind' : 'Settle Up'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {showAddGroup && <AddGroupModal onClose={() => setShowAddGroup(false)} onSave={addGroup as any} />}
      {showAddExpense && activeGroup && (
        <AddExpenseModal 
          group={activeGroup} 
          onClose={() => setShowAddExpense(false)} 
          onSave={addExpense as any} 
          onSaveTransaction={addTransaction as any}
        />
      )}
    </main>
  );
}

function AddGroupModal({ onClose, onSave }: { onClose: () => void; onSave: (g: any) => Promise<void> }) {
  const [name, setName] = useState("");
  const [membersStr, setMembersStr] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name) return;
    setSaving(true);
    const members = membersStr.split(',').map(m => m.trim()).filter(Boolean).map(m => ({ name: m }));
    await onSave({ name, description: 'Added manually', members });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-xl">
      <div className="glass-card w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">New Split Group</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500">Group Name</label>
            <input className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2" type="text" placeholder="Ski Trip 2024" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500">Members (Comma separated)</label>
            <input className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2" type="text" placeholder="Sarah, Mark, John" value={membersStr} onChange={e => setMembersStr(e.target.value)} />
            <p className="text-xs text-slate-500 mt-1">* You are automatically included.</p>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-bold hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-[2] py-2.5 rounded-lg bg-primary text-white text-sm font-bold transition-all disabled:opacity-50">Create</button>
        </div>
      </div>
    </div>
  );
}

function AddExpenseModal({ group, onClose, onSave, onSaveTransaction }: { group: SplitGroup, onClose: () => void; onSave: (e: any) => Promise<void>, onSaveTransaction: (tx: any) => Promise<void> }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("You");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!desc) return setError("Description required");
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return setError("Valid amount required");

    setSaving(true);
    try {
      await onSave({
        groupId: group.id,
        description: desc,
        totalAmount: parsedAmount,
        paidBy: paidBy,
        splitEqually: true,
        date: new Date().toISOString().split('T')[0]
      });

      // Mirror to transactions if YOU paid so the Dashboard balances match your pocket
      if (paidBy === 'You') {
        await onSaveTransaction({
          amount: parsedAmount,
          type: 'debit',
          categoryId: 'splits',
          merchant: desc,
          date: new Date().toISOString().split('T')[0],
          isRecurring: false,
          accountId: 'default',
          source: 'manual'
        });
      }

      onClose();
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  };

  const payerOptions = ['You', ...group.members.map(m => m.name)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-xl">
      <div className="glass-card w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Add Expense</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
            <input className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2" type="text" placeholder="Dinner at Joe's" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500">Total Amount (₹)</label>
            <input className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2" type="number" placeholder="1000" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500">Paid By</label>
            <select className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
              {payerOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-bold hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-[2] py-2.5 rounded-lg bg-primary text-white text-sm font-bold transition-all disabled:opacity-50">Save Expense</button>
        </div>
      </div>
    </div>
  );
}
