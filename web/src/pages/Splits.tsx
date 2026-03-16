import { useState, useMemo } from "react";
import { useSplits } from "../hooks/useSplits";
import { useTransactions } from "../hooks/useTransactions";
import { formatINR } from "../lib/dashboardStats";
import type { SplitGroup, SplitExpense, SplitPayer, SplitOwer } from "../types";

export default function SplitsPage() {
  const { groups, expenses, settlements, addGroup, addExpense, addSettlement, updateExpense, deleteExpense } = useSplits();
  const { addTransaction } = useTransactions();
  
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<SplitExpense | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId) || groups[0], [groups, activeGroupId]);

  if (!activeGroupId && groups.length > 0) setActiveGroupId(groups[0].id);

  const groupExpenses = useMemo(() => expenses.filter(e => e.groupId === activeGroup?.id), [expenses, activeGroup]);
  const groupSettlements = useMemo(() => settlements.filter(s => s.groupId === activeGroup?.id), [settlements, activeGroup]);

  const balances = useMemo(() => {
    if (!activeGroup) return {};
    const members = ['You', ...activeGroup.members.map(m => m.name)];
    const bals: Record<string, number> = {};
    members.forEach(m => bals[m] = 0);

    groupExpenses.forEach((exp: any) => {
      const payers = exp.payers || (exp.paidBy ? [{ memberName: exp.paidBy, amountPaid: exp.totalAmount }] : []);
      
      let owers = exp.owers || [];
      if (owers.length === 0 && exp.splitEqually !== undefined) {
        const splitAmount = exp.totalAmount / members.length;
        owers = members.map(m => ({ memberName: m, amountOwed: splitAmount }));
      }

      payers.forEach((p: any) => {
        if (bals[p.memberName] !== undefined) bals[p.memberName] += p.amountPaid;
      });
      owers.forEach((o: any) => {
        if (bals[o.memberName] !== undefined) bals[o.memberName] -= o.amountOwed;
      });
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
    
    const from = direction === 'i_owe' ? 'You' : memberName;
    const to = direction === 'i_owe' ? memberName : 'You';
    
    await addSettlement({
      groupId: activeGroup.id,
      from,
      to,
      amount,
      date: new Date().toISOString().split('T')[0]
    });

    if (direction === 'i_owe') {
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
                  <button onClick={() => { setExpenseToEdit(null); setShowExpenseModal(true); }} className="bg-primary hover:bg-primary/90 text-white rounded-lg h-11 px-6 flex items-center gap-2 font-bold transition-all whitespace-nowrap">
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

              <div className="mb-10 shrink-0 w-full">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 shrink-0">
                  <span className="material-icons-outlined text-primary">history</span>
                  Recent Activity
                </h3>
                <div className="space-y-4 w-full">
                  {groupExpenses.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 glass-panel rounded-xl">No expenses recorded yet.</div>
                  ) : (
                    groupExpenses.map(exp => {
                      // Safety checks for legacy data migrations
                      const payers = exp.payers || [];
                      const owers = exp.owers || [];
                      
                      const myPayer = payers.find(p => p.memberName === 'You');
                      const myOwer = owers.find(o => o.memberName === 'You');
                      
                      const paidByMe = myPayer ? myPayer.amountPaid : 0;
                      const owedByMe = myOwer ? myOwer.amountOwed : 0;
                      
                      const net = paidByMe - owedByMe;
                      
                      let oweStatus = "";
                      let oweAmount = "";
                      let colorClass = "";
                      
                      if (net > 0) {
                        oweStatus = "You lent";
                        oweAmount = formatINR(net);
                        colorClass = "text-emerald-400";
                      } else if (net < 0) {
                        oweStatus = "You borrowed";
                        oweAmount = formatINR(Math.abs(net));
                        colorClass = "text-rose-400";
                      } else {
                        oweStatus = "Not involved";
                        oweAmount = "₹0";
                        colorClass = "text-slate-500";
                      }

                      const primaryPayer = payers[0]?.memberName || 'Someone';
                      const payerText = payers.length > 1 ? `${payers.length} people` : primaryPayer;

                      return (
                        <div key={exp.id} className="glass-panel p-4 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all group relative">
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
                                  Paid by {payerText}
                                </span>
                                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap">
                                  {exp.splitType}
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
                            <div className="relative">
                              <button 
                                onClick={() => setOpenMenuId(openMenuId === exp.id ? null : exp.id)}
                                className="material-icons-outlined text-slate-600 hover:text-white transition-colors shrink-0 p-1"
                              >
                                more_vert
                              </button>
                              {openMenuId === exp.id && (
                                <div className="absolute right-0 top-full mt-2 w-36 glass-dropdown rounded-lg shadow-xl overflow-hidden z-50 border border-slate-700/50">
                                  <button onClick={() => { setExpenseToEdit(exp); setShowExpenseModal(true); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
                                    <span className="material-icons-outlined text-sm">edit</span> Edit
                                  </button>
                                  <button onClick={() => { if(window.confirm('Delete expense?')) { deleteExpense(exp.id); } setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors flex items-center gap-2">
                                    <span className="material-icons-outlined text-sm">delete</span> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 shrink-0 w-full overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-4">Group Balances</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {activeGroup.members.map((m, idx) => {
                    const b = balances[m.name] || 0;
                    if (Math.abs(b) < 0.01) return (
                      <div key={idx} className="glass-panel p-4 rounded-xl flex items-center justify-between shrink-0 min-w-[280px] snap-center">
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
                    const isOwingMe = b < 0;
                    
                    return (
                      <div key={idx} className="glass-panel p-4 rounded-xl flex items-center justify-between shrink-0 min-w-[280px] snap-center">
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
      {showExpenseModal && activeGroup && (
        <ExpenseModal 
          group={activeGroup} 
          expenseToEdit={expenseToEdit}
          onClose={() => { setShowExpenseModal(false); setExpenseToEdit(null); }} 
          onSave={expenseToEdit ? ((e: any) => updateExpense(expenseToEdit.id, e)) as any : addExpense as any} 
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

function ExpenseModal({ group, expenseToEdit, onClose, onSave, onSaveTransaction }: { group: SplitGroup, expenseToEdit: SplitExpense | null, onClose: () => void; onSave: (e: any) => Promise<void>, onSaveTransaction: (tx: any) => Promise<void> }) {
  const [desc, setDesc] = useState(expenseToEdit?.description || "");
  const [amountStr, setAmountStr] = useState(expenseToEdit ? expenseToEdit.totalAmount.toString() : "");
  const totalAmount = parseFloat(amountStr) || 0;
  
  const [splitType, setSplitType] = useState<SplitExpense['splitType']>(expenseToEdit?.splitType || 'equal');
  const allMembers = useMemo(() => ['You', ...group.members.map(m => m.name)], [group]);
  const [paidBy, setPaidBy] = useState(expenseToEdit?.payers[0]?.memberName || "You");
  
  const [exactAmounts, setExactAmounts] = useState<Record<string, string>>(() => {
    if (expenseToEdit?.splitType === 'exact') {
      const init: Record<string, string> = {};
      expenseToEdit.owers.forEach(o => init[o.memberName] = o.amountOwed.toString());
      return init;
    }
    return {};
  });
  const [percentages, setPercentages] = useState<Record<string, string>>(() => {
    if (expenseToEdit?.splitType === 'percentage') {
      const init: Record<string, string> = {};
      expenseToEdit.owers.forEach(o => { if (o.percentage) init[o.memberName] = o.percentage.toString(); });
      return init;
    }
    return {};
  });
  const [shares, setShares] = useState<Record<string, string>>(() => {
    if (expenseToEdit?.splitType === 'shares') {
      const init: Record<string, string> = {};
      expenseToEdit.owers.forEach(o => { if (o.shares) init[o.memberName] = o.shares.toString(); });
      return init;
    }
    return {};
  });
  const [selectedEqualOwers, setSelectedEqualOwers] = useState<string[]>(() => {
    if (expenseToEdit && expenseToEdit.splitType === 'equal') {
      return expenseToEdit.owers.map(o => o.memberName);
    }
    return allMembers;
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!desc) return setError("Description required");
    if (totalAmount <= 0) return setError("Valid amount required");

    let owers: SplitOwer[] = [];
    
    if (splitType === 'equal') {
      if (selectedEqualOwers.length === 0) return setError("Select at least one person to split with");
      const splitAmount = totalAmount / selectedEqualOwers.length;
      owers = selectedEqualOwers.map(m => ({ memberName: m, amountOwed: splitAmount }));
    } else if (splitType === 'exact') {
      let sum = 0;
      owers = allMembers.map(m => {
        const val = parseFloat(exactAmounts[m]) || 0;
        sum += val;
        return { memberName: m, amountOwed: val };
      }).filter(o => o.amountOwed > 0);
      if (Math.abs(sum - totalAmount) > 0.01) return setError(`Exact amounts must sum to ${totalAmount}. Currently: ${sum}`);
    } else if (splitType === 'percentage') {
      let sumPct = 0;
      owers = allMembers.map(m => {
        const pct = parseFloat(percentages[m]) || 0;
        sumPct += pct;
        return { memberName: m, amountOwed: (totalAmount * pct) / 100, percentage: pct };
      }).filter(o => o.percentage && o.percentage > 0);
      if (Math.abs(sumPct - 100) > 0.01) return setError(`Percentages must sum to 100%. Currently: ${sumPct}%`);
    } else if (splitType === 'shares') {
      let totalShares = 0;
      allMembers.forEach(m => totalShares += (parseFloat(shares[m]) || 0));
      if (totalShares <= 0) return setError("Total shares must be > 0");
      owers = allMembers.map(m => {
        const sh = parseFloat(shares[m]) || 0;
        return { memberName: m, amountOwed: (totalAmount * sh) / totalShares, shares: sh };
      }).filter(o => o.shares && o.shares > 0);
    } else if (splitType === 'itemized') {
       return setError("Itemized receipt scanning requires Gemini API Premium.");
    }

    setSaving(true);
    try {
      const payers: SplitPayer[] = [{ memberName: paidBy, amountPaid: totalAmount }];
      
      await onSave({
        groupId: group.id,
        description: desc,
        totalAmount,
        category: 'General',
        payers,
        splitType,
        owers,
        date: new Date().toISOString().split('T')[0]
      });

      if (paidBy === 'You' && !expenseToEdit) {
        await onSaveTransaction({
          amount: totalAmount,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-xl">
      <div className="glass-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-bold text-white">{expenseToEdit ? 'Edit Expense' : 'Add Expense'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="flex gap-4">
            <div className="space-y-1.5 flex-[2]">
              <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
              <input className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2" type="text" placeholder="Dinner at Joe's" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] uppercase font-bold text-slate-500">Total (₹)</label>
              <input className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-white px-3 py-2" type="number" placeholder="1000" value={amountStr} onChange={e => setAmountStr(e.target.value)} />
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
             <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <span className="material-icons-outlined text-primary text-sm">receipt_long</span>
             </div>
             <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-200">Upload Receipt</h4>
                <p className="text-xs text-slate-400 mt-1 mb-2">Itemize your bill instantly using Gemini AI (Pro Feature)</p>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors cursor-pointer border border-primary/30 bg-primary/10 px-3 py-1.5 rounded-lg">
                   <span className="material-icons-outlined text-sm">file_upload</span>
                   Upload Image
                   <input type="file" className="hidden" accept="image/*" onChange={() => alert("Mock: Gemini API OCR feature coming soon!")} />
                </label>
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-500">Paid By</label>
            <select className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary text-slate-300 px-3 py-2" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
              {allMembers.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Split Options</label>
            
            <div className="flex bg-slate-900 rounded-lg p-1 gap-1 border border-slate-800">
               {['equal', 'exact', 'percentage', 'shares'].map((tab) => (
                 <button 
                  key={tab}
                  onClick={() => setSplitType(tab as any)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${splitType === tab ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 space-y-3">
              {splitType === 'equal' && (
                <>
                  <p className="text-xs text-slate-400 mb-2">Select who is splitting {totalAmount > 0 ? formatINR(totalAmount) : ''} equally:</p>
                  {allMembers.map(m => (
                    <label key={m} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedEqualOwers.includes(m)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedEqualOwers([...selectedEqualOwers, m]);
                          else setSelectedEqualOwers(selectedEqualOwers.filter(x => x !== m));
                        }}
                        className="rounded border-slate-700 text-primary focus:ring-primary focus:ring-offset-slate-900 bg-slate-800"
                      />
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{m}</span>
                    </label>
                  ))}
                  {selectedEqualOwers.length > 0 && totalAmount > 0 && (
                    <div className="pt-2 border-t border-slate-800/50 text-xs text-emerald-400 font-medium">
                      {formatINR(totalAmount / selectedEqualOwers.length)} / person
                    </div>
                  )}
                </>
              )}

              {splitType === 'exact' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                     <p className="text-xs text-slate-400">Enter exact amounts</p>
                     <p className="text-xs text-slate-500">{totalAmount - Object.values(exactAmounts).reduce((a, b) => a + (parseFloat(b) || 0), 0)} left</p>
                  </div>
                  {allMembers.map(m => (
                    <div key={m} className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-slate-300 w-1/3 truncate">{m}</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={exactAmounts[m] || ''}
                          onChange={(e) => setExactAmounts(prev => ({...prev, [m]: e.target.value}))}
                          className="w-full bg-slate-800 border-slate-700 rounded-lg text-sm text-right pr-3 pl-8 py-1.5 focus:ring-primary text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {splitType === 'percentage' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                     <p className="text-xs text-slate-400">Enter percentages (%)</p>
                     <p className="text-xs text-slate-500">{100 - Object.values(percentages).reduce((a, b) => a + (parseFloat(b) || 0), 0)}% left</p>
                  </div>
                  {allMembers.map(m => (
                    <div key={m} className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-slate-300 w-1/3 truncate">{m}</span>
                      <div className="relative flex-1">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
                        <input 
                          type="number" 
                          placeholder="0"
                          value={percentages[m] || ''}
                          onChange={(e) => setPercentages(prev => ({...prev, [m]: e.target.value}))}
                          className="w-full bg-slate-800 border-slate-700 rounded-lg text-sm text-right pr-8 pl-3 py-1.5 focus:ring-primary text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {splitType === 'shares' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 mb-2">Assign shares to members</p>
                  {allMembers.map(m => (
                    <div key={m} className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-slate-300 w-1/3 truncate">{m}</span>
                      <div className="flex-1 flex gap-2">
                        <input 
                          type="number" 
                          placeholder="1"
                          value={shares[m] || ''}
                          onChange={(e) => setShares(prev => ({...prev, [m]: e.target.value}))}
                          className="w-full bg-slate-800 border-slate-700 rounded-lg text-sm text-center px-3 py-1.5 focus:ring-primary text-white"
                        />
                        <span className="text-xs text-slate-500 self-center">share(s)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {error && <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{error}</p>}
        </div>
        
        <div className="p-6 border-t border-slate-800 flex gap-3 shrink-0 bg-background-dark/50">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-bold hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-[2] py-2.5 rounded-lg bg-primary text-white text-sm font-bold transition-all disabled:opacity-50 hover:bg-primary/90">
            {expenseToEdit ? 'Save Changes' : 'Save Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
