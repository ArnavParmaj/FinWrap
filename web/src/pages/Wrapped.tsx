export default function WrappedPage() {
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
            FINWRAP · MARCH 2025
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
              ₹28,400
            </h1>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="material-icons-outlined text-emerald-500 text-sm">trending_down</span>
              <p className="text-emerald-500 text-sm font-bold">
                You saved ₹6,200
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
                  <p className="text-base font-bold text-white">
                    Food & Dining
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-white">₹12,400</p>
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
                  <p className="text-base font-bold text-white">
                    Wireless Headphones
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-white">₹8,999</p>
            </div>

            {/* Streak */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <span className="material-icons-outlined">auto_graph</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Savings Streak
                  </p>
                  <p className="text-base font-bold text-white">
                    3 Months Strong
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-emerald-500">+12%</p>
            </div>
          </div>

          {/* AI Roast */}
          <div className="pt-4 border-t border-white/10 relative z-10">
            <div className="flex gap-2 items-start opacity-70 italic text-slate-400 text-sm">
              <span className="material-icons-outlined text-primary text-base shrink-0 mt-0.5">smart_toy</span>
              <p>
                "You spent enough on coffee this month to buy a small
                plantation. Maybe your 'savings' are just your baristas feeling
                sorry for you?"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          <button className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20">
            <span className="material-icons-outlined">download</span>
            <span>Download</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold py-4 rounded-2xl transition-all border border-white/10">
            <span className="material-icons-outlined">share</span>
            <span>Share Moment</span>
          </button>
        </div>

        {/* Footer Meta */}
        <div className="flex justify-center items-center gap-6 mt-4">
          <div className="flex items-center gap-1.5 opacity-50">
            <span className="material-icons-outlined text-sm">verified_user</span>
            <span className="text-xs font-medium uppercase tracking-tighter">
              Bank-Grade Security
            </span>
          </div>
          <div className="flex items-center gap-1.5 opacity-50">
            <span className="material-icons-outlined text-sm">history</span>
            <span className="text-xs font-medium uppercase tracking-tighter">
              Updated 2m ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
