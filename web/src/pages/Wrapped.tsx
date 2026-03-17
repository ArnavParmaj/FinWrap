import { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';

// Simple formatter
const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function WrappedPage() {
  const { transactions } = useTransactions();

  const {
    totalSpent,
    totalSaved,
    biggestCategory,
    biggestSplurge,
    categorySplurgeAmount,
    mostFrequentedMerchant,
    roastText
  } = useMemo(() => {
    let spent = 0;
    let income = 0;
    const catMap: Record<string, number> = {};
    const merchantMap: Record<string, number> = {};
    let topSplurge = { merchant: 'Nothing yet', amount: 0 };
    
    // Using current month for this example 'wrapped' scope
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const monthTx = transactions.filter(t => t.date.startsWith(currentMonthPrefix));

    monthTx.forEach(t => {
      if (t.type === 'debit') {
        spent += t.amount;
        catMap[t.categoryId] = (catMap[t.categoryId] || 0) + t.amount;
        merchantMap[t.merchant] = (merchantMap[t.merchant] || 0) + 1;
        
        if (t.amount > topSplurge.amount) {
          topSplurge = { merchant: t.merchant, amount: t.amount };
        }
      } else {
        income += t.amount;
      }
    });

    let topCat = 'None';
    let topCatVal = 0;
    Object.entries(catMap).forEach(([cat, val]) => {
      if (val > topCatVal) {
        topCatVal = val;
        // capitalize category name for display
        topCat = cat.charAt(0).toUpperCase() + cat.slice(1);
      }
    });

    let topMerchant = 'Unknown';
    let topMerchVal = 0;
    Object.entries(merchantMap).forEach(([m, val]) => {
      if (val > topMerchVal) {
        topMerchVal = val;
        topMerchant = m;
      }
    });

    const saved = income - spent;
    
    let roast = "You haven't spent much this month. Excellent discipline, or just forgot your wallet?";
    if (spent > income && income > 0) {
      roast = `Your income was ${formatINR(income)}, but your spending was ${formatINR(spent)}. The math isn't mathing.`;
    } else if (topCat === 'Dining' || topCatVal > spent * 0.3) {
      roast = `"You spent enough on ${topCat} this month to buy a small plantation. Maybe your 'savings' are just your baristas feeling sorry for you?"`;
    } else if (topSplurge.amount > spent * 0.4 && spent > 0) {
      roast = `"That ${topSplurge.merchant} purchase accounted for nearly half your monthly spend. Hope it was worth it."`;
    } else if (saved > spent && spent > 0) {
      roast = `"You saved more than you spent. We'd roast you, but honestly we're just intimidated."`;
    }

    return {
      totalSpent: spent,
      totalSaved: saved,
      biggestCategory: topCat,
      categorySplurgeAmount: topCatVal,
      biggestSplurge: topSplurge,
      mostFrequentedMerchant: topMerchant,
      roastText: roast
    };
  }, [transactions]);

  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' });

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 sm:p-10 aurora-glow">
      {/* Main Container: 480px width */}
      <div className="w-full max-w-[480px] flex flex-col gap-8 mb-24">
        {/* Header Branding */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-icons-outlined text-3xl">rocket_launch</span>
            <span className="text-xl font-extrabold tracking-tight">
              FinWrap
            </span>
          </div>
          <h3 className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase">
            FINWRAP · {currentMonthName.toUpperCase()} {new Date().getFullYear()}
          </h3>
        </div>

        {/* The Wrapped Card */}
        <div className="glass-card border border-primary/30 rounded-3xl p-8 flex flex-col gap-10 relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-background-dark">
          {/* Inner Glow Pattern */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 blur-3xl rounded-full"></div>

          {/* Main Stat */}
          <div className="flex flex-col items-center text-center gap-2 relative z-10">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Total Spent
            </p>
            <h1 className="text-6xl font-extrabold text-white tracking-tighter">
              {formatINR(totalSpent)}
            </h1>
            <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 ${totalSaved >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'} border rounded-full`}>
              <span className={`material-icons-outlined text-sm ${totalSaved >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {totalSaved >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              <p className={`text-sm font-bold ${totalSaved >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {totalSaved >= 0 ? `You saved ${formatINR(totalSaved)}` : `Overspent by ${formatINR(Math.abs(totalSaved))}`}
              </p>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 gap-4 relative z-10">
            {/* Category */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-icons-outlined">restaurant</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Biggest Category
                  </p>
                  <p className="text-base font-bold text-white truncate max-w-[150px]">
                    {biggestCategory}
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-white whitespace-nowrap">{formatINR(categorySplurgeAmount)}</p>
            </div>

            {/* Splurge */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                  <span className="material-icons-outlined">shopping_bag</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Biggest Splurge
                  </p>
                  <p className="text-base font-bold text-white truncate max-w-[150px]">
                    {biggestSplurge.merchant || 'None'}
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-white whitespace-nowrap">{formatINR(biggestSplurge.amount)}</p>
            </div>

            {/* Streak */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <span className="material-icons-outlined">auto_graph</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Favorite Merchant
                  </p>
                  <p className="text-base font-bold text-white truncate max-w-[150px]">
                    {mostFrequentedMerchant}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Roast */}
          <div className="pt-4 border-t border-white/10 relative z-10">
            <div className="flex gap-2 items-start opacity-70 italic text-slate-400 text-sm">
              <span className="material-icons-outlined text-primary text-base shrink-0 mt-0.5">smart_toy</span>
              <p>
                {roastText}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
