export default function InsightsPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 glass-card shrink-0">
        <div className="flex items-center gap-4">
          <span className="material-icons-outlined text-slate-400">search</span>
          <input
            className="bg-transparent border-none text-sm focus:ring-0 placeholder-slate-500 w-64"
            placeholder="Search transactions, reports..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-6">
          <button className="relative text-slate-400 hover:text-white">
            <span className="material-icons-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-background-dark"></span>
          </button>
          <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
            <div className="text-right">
              <p className="text-xs font-bold">Alex Sterling</p>
              <p className="text-[10px] text-slate-500">Pro Member</p>
            </div>
            <img
              className="w-10 h-10 rounded-full border border-slate-700"
              alt="User profile avatar of Alex Sterling"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7dTpAEaXpYGMHNAE0F2XtcQQ2SnwspbwCLpCQ7N0PcS9tY9TqkEv_CBwvmntP-efmdTJg3_oazz_WmRGCekI8oUMeDRb6r9cLusfUrPZeR69uUS1lpsVm2KQISYGEQZcbatClMtcrMSdIKbJXoxY4dCuZpMXSv4KWPpZmCb8bPEIN6J2fCIviBtdwxi9n76USEsc6rKZ1E-YX3pO2ecQxK-d-CuJsM07_LdY-VsEgtTOi69K7fL8am03upLbqkOP3fM0KooLowTs"
            />
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-48">
        {/* Hero Section / Editorial Layout */}
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
                Detailed analysis of your financial behavior between Oct 12 —
                Oct 19.
              </p>
            </div>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
              <span className="material-icons-outlined text-sm">download</span>
              Export PDF
            </button>
          </div>

          {/* Weekly Digest Glass Card */}
          <div className="border border-primary/20 bg-background-dark/80 p-8 relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-icons-outlined text-9xl">auto_awesome</span>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 relative z-10">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-icons-outlined text-primary">psychology</span>
                  AI Narrative Analysis
                </h3>
                <p className="text-slate-300 text-[16px] leading-relaxed mb-6">
                  Your spending velocity has{" "}
                  <span className="text-emerald-400 font-bold">
                    decelerated by 12%
                  </span>{" "}
                  this week. We noticed a significant shift from physical retail
                  to digital services. Your recurring subscriptions are
                  currently optimized, but our predictive engine suggests a{" "}
                  <span className="text-primary font-bold">
                    potential savings of $120
                  </span>{" "}
                  if you consolidate your cloud storage plans. Current
                  projection: You are on track to exceed your savings goal by{" "}
                  <span className="text-emerald-400 font-bold">$450</span> by
                  end of month.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Weekly Spend
                    </p>
                    <p className="text-2xl font-bold text-slate-100">$2,430</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Savings Rate
                    </p>
                    <p className="text-2xl font-bold text-primary">32%</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Cash Flow
                    </p>
                    <p className="text-2xl font-bold text-emerald-400">
                      +$1,200
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Risk Level
                    </p>
                    <p className="text-2xl font-bold text-slate-100">Low</p>
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
            <span className="bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Requires Action
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Anomaly Card 1 */}
            <div className="glass-card p-6 rounded-xl border-l-4 border-l-rose-500 shadow-[20px_0_40px_-20px_rgba(244,63,94,0.15)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Oct 18, 2023</p>
                  <h4 className="font-bold text-lg">Unknown Merchant</h4>
                </div>
                <span className="text-rose-400 font-bold">-$499.00</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                This transaction originated from a restricted region (LATAM) and
                doesn't match your typical spending profile.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 text-xs font-bold rounded-lg border border-slate-700 text-slate-400 hover:bg-white/5 transition-all">
                  Looks Valid
                </button>
                <button className="flex-1 py-2 text-xs font-bold rounded-lg border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                  Flag It
                </button>
              </div>
            </div>

            {/* Anomaly Card 2 */}
            <div className="glass-card p-6 rounded-xl border-l-4 border-l-rose-500 shadow-[20px_0_40px_-20px_rgba(244,63,94,0.15)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Oct 17, 2023</p>
                  <h4 className="font-bold text-lg">CloudSaaS Recurring</h4>
                </div>
                <span className="text-rose-400 font-bold">-$89.00</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Duplicate subscription charge detected. This is the second
                charge from this merchant in 24 hours.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 text-xs font-bold rounded-lg border border-slate-700 text-slate-400 hover:bg-white/5 transition-all">
                  Looks Valid
                </button>
                <button className="flex-1 py-2 text-xs font-bold rounded-lg border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                  Flag It
                </button>
              </div>
            </div>

            {/* Anomaly Card 3 */}
            <div className="glass-card p-6 rounded-xl border-l-4 border-l-rose-500 shadow-[20px_0_40px_-20px_rgba(244,63,94,0.15)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Oct 15, 2023</p>
                  <h4 className="font-bold text-lg">Global Hotel Group</h4>
                </div>
                <span className="text-rose-400 font-bold">-$1,240.00</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                High-value transaction without pre-authorization or associated
                travel flight booking found.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 text-xs font-bold rounded-lg border border-slate-700 text-slate-400 hover:bg-white/5 transition-all">
                  Looks Valid
                </button>
                <button className="flex-1 py-2 text-xs font-bold rounded-lg border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                  Flag It
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Ask FinWrap Interaction Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center pointer-events-none">
        {/* Response Card */}
        <div className="w-full max-w-4xl glass-card p-6 rounded-2xl mb-4 pointer-events-auto border border-primary/20 bg-background-dark/80">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <span className="material-icons-outlined text-primary text-sm">auto_awesome</span>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-slate-200">
                I've analyzed your travel expenses for Q3. You spent{" "}
                <span className="text-primary font-bold">$4,200</span> on
                flights and hotels. By switching to your Chase Sapphire card for
                these specific categories, you would have earned{" "}
                <span className="text-emerald-400 font-bold">
                  12,600 additional points
                </span>
                . Would you like me to set up a category-specific payment
                reminder?
              </p>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="w-full max-w-4xl glass-card rounded-2xl p-2 pointer-events-auto border-slate-700/50 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <span className="material-icons-outlined text-slate-500">colors_spark</span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 text-white placeholder-slate-500"
                placeholder="Ask FinWrap anything about your finances..."
                type="text"
              />
            </div>
            <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-icons-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
