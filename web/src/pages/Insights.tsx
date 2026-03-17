import { useMemo, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { generateDeepInsights as fetchGeminiInsights } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';

// Simple formatter
const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function InsightsPage() {
  const { transactions } = useTransactions();
  const [dismissedAnomalies, setDismissedAnomalies] = useState<string[]>([]);
  const [flaggedAnomalies, setFlaggedAnomalies] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Calculate Last 7 Days metrics
  const { weeklySpend, weeklyIncome, cashFlow, anomalies, currentWeekStr } = useMemo(() => {
    const now = new Date();
    const weekStart = new Date();
    weekStart.setDate(now.getDate() - 7);
    
    const weekTx = transactions.filter(t => new Date(t.date) >= weekStart);
    
    let spend = 0;
    let income = 0;
    
    // An anomaly is defined as any single debit > 5000 for this basic non-AI version
    const foundAnomalies: { id: string; date: string; merchant: string; amount: number; reason: string }[] = [];

    weekTx.forEach(t => {
      if (t.type === 'debit') {
        spend += t.amount;
        if (t.amount > 5000) {
          foundAnomalies.push({
            id: t.id,
            date: t.date,
            merchant: t.merchant,
            amount: t.amount,
            reason: "High-value transaction detected automatically."
          });
        }
      } else {
        income += t.amount;
      }
    });

    const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      weeklySpend: spend,
      weeklyIncome: income,
      cashFlow: income - spend,
      anomalies: foundAnomalies,
      currentWeekStr: `${startStr} — ${endStr}`
    };
  }, [transactions]);

  // Filter out anomalies the user has already interacted with
  const activeAnomalies = anomalies.filter(a => !dismissedAnomalies.includes(a.id) && !flaggedAnomalies.includes(a.id));

  const handleExportPDF = () => {
    window.print();
  };

  const handleLooksValid = (id: string) => {
    setDismissedAnomalies(prev => [...prev, id]);
  };

  const handleFlagIt = (id: string) => {
    setFlaggedAnomalies(prev => [...prev, id]);
    alert("Transaction flagged for review. A support ticket placeholder would be created here.");
  };

  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    setAiError(null);
    try {
      const resp = await fetchGeminiInsights(transactions);
      setAiResponse(resp);
    } catch (err: any) {
      setAiError(err.message || "Failed to generate insights.");
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-12">
        {/* Hero Section */}
        <section>
          <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
            <div className="max-w-2xl">
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">
                Personal Digest
              </span>
              <h2 className="text-4xl font-black tracking-tight leading-tight">
                Weekly <span className="text-primary">Intelligence</span> Recap
              </h2>
              <p className="text-slate-400 mt-2 text-lg">
                Detailed analysis of your financial behavior between {currentWeekStr}.
              </p>
            </div>
            <button 
              onClick={handleExportPDF}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            >
              <span className="material-icons-outlined text-sm">download</span>
              Export Report
            </button>
          </div>

          {/* Weekly Digest Glass Card */}
          <div className="border border-primary/20 bg-background-dark/80 p-8 relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-icons-outlined text-9xl">auto_awesome</span>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 relative z-10">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-icons-outlined text-primary">psychology</span>
                    Automated Narrative Analysis
                  </h3>
                  <button 
                    onClick={handleGenerateInsights}
                    disabled={loadingInsights}
                    className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/30 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <span className={`material-icons-outlined text-[14px] ${loadingInsights ? 'animate-spin' : ''}`}>
                      {loadingInsights ? 'sync' : 'bolt'}
                    </span>
                    {loadingInsights ? 'Scanning...' : aiResponse ? 'Regenerate Scan' : 'Run Deep Scan'}
                  </button>
                </div>

                {/* AI Response Area */}
                {aiError && (
                  <div className="bg-rose-500/20 text-rose-400 p-4 rounded-xl border border-rose-500/20 mb-6 text-sm">
                    {aiError}
                  </div>
                )}
                
                {aiResponse ? (
                  <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-a:text-primary max-w-none mb-6">
                     <ReactMarkdown>{aiResponse}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-slate-300 text-[16px] leading-relaxed mb-6">
                     Based on your recent activity, you have spent <span className="text-rose-400 font-bold">{formatINR(weeklySpend)}</span> this week. 
                     Your total inflowing cash was <span className="text-emerald-400 font-bold">{formatINR(weeklyIncome)}</span>.
                     {cashFlow > 0 
                       ? " You are running a positive cash flow, which is excellent for your savings goals!" 
                       : " Your spending has exceeded your income for this period. Consider reviewing the anomalies below."}
                     <br/><br/>
                     <span className="text-sm text-slate-500 italic">* Deep AI analysis requires a Gemini API key. Click "Run Deep Scan" to generate advanced insights once configured.</span>
                  </p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Weekly Spend
                    </p>
                    <p className="text-2xl font-bold text-slate-100">{formatINR(weeklySpend)}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Transactions
                    </p>
                    <p className="text-2xl font-bold text-primary">{transactions.filter(t => new Date(t.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Net Cash Flow
                    </p>
                    <p className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {cashFlow > 0 ? '+' : ''}{formatINR(cashFlow)}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Risk Level
                    </p>
                    <p className="text-2xl font-bold text-slate-100">{weeklySpend > weeklyIncome ? 'Elevated' : 'Low'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Anomalies Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold">Flagged Anomalies</h3>
            {activeAnomalies.length > 0 && (
              <span className="bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {activeAnomalies.length} Requires Action
              </span>
            )}
          </div>

          {activeAnomalies.length === 0 ? (
            <div className="glass-panel p-8 rounded-xl text-center border-dashed border-2 border-white/10">
               <span className="material-icons-outlined text-4xl text-emerald-400 mb-3 block">verified_user</span>
               <h4 className="text-lg font-bold text-white mb-2">No Anomalies Detected</h4>
               <p className="text-sm text-slate-400">Your spending patterns look normal for this period. No unusual or high-value suspicious transactions found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAnomalies.map(anomaly => (
                <div key={anomaly.id} className="glass-card p-6 rounded-xl border-l-4 border-l-rose-500 shadow-[20px_0_40px_-20px_rgba(244,63,94,0.15)]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">{anomaly.date}</p>
                      <h4 className="font-bold text-lg truncate max-w-[150px]">{anomaly.merchant}</h4>
                    </div>
                    <span className="text-rose-400 font-bold">-{formatINR(anomaly.amount)}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    {anomaly.reason}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleLooksValid(anomaly.id)}
                      className="flex-1 py-2 text-xs font-bold rounded-lg border border-slate-700 text-slate-400 hover:bg-white/5 transition-all"
                    >
                      Looks Valid
                    </button>
                    <button 
                      onClick={() => handleFlagIt(anomaly.id)}
                      className="flex-1 py-2 text-xs font-bold rounded-lg border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Flag It
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
