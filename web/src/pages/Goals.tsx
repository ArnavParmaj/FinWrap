export default function GoalsPage() {
  return (
    <>
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-background-dark/30 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Goals Overview</h2>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                search
              </span>
              <input
                className="bg-slate-900/50 border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:ring-primary focus:border-primary w-64"
                placeholder="Search goals..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="size-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/5">
              <span className="material-icons-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right"></div>
              <div className="size-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden"></div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Hero Stats */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-3xl font-black tracking-tight mb-2">
                Your Milestones
              </h3>
              <p className="text-slate-400">
                You're saving 12% more this month compared to July.
              </p>
            </div>
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
              <span className="material-icons-outlined text-lg">
                add_circle
              </span>
              Create New Goal
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-6 border-b border-slate-800 mb-8">
            <button className="pb-4 px-2 border-b-2 border-primary text-primary font-bold text-sm">
              Active Goals (4)
            </button>
            <button className="pb-4 px-2 border-b-2 border-transparent text-slate-500 font-medium text-sm hover:text-slate-300">
              Completed
            </button>
            <button className="pb-4 px-2 border-b-2 border-transparent text-slate-500 font-medium text-sm hover:text-slate-300">
              Archived
            </button>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Goal Card 1 */}
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-400 opacity-50"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold mb-1">Tokyo Summer Trip</h4>
                  <p className="text-sm text-slate-400">
                    Target: <span className="text-slate-200">₹450,000</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  On Track
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-300">
                    ₹315,000 saved
                  </span>
                  <span className="text-slate-500">70% reached</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div className="h-full w-[70%] bg-primary progress-glow rounded-full transition-all duration-1000"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      Monthly Pace
                    </span>
                    <span className="text-sm font-semibold">₹15,000/mo</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      Deadline
                    </span>
                    <span className="text-sm font-semibold">May 2024</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-primary text-sm font-bold hover:underline">
                  <span className="material-icons-outlined text-lg">add</span>
                  Add Contribution
                </button>
              </div>
            </div>

            {/* Goal Card 2 */}
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold mb-1">New Tesla Model 3</h4>
                  <p className="text-sm text-slate-400">
                    Target: <span className="text-slate-200">₹4,500,000</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                  Behind
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-300">
                    ₹850,000 saved
                  </span>
                  <span className="text-slate-500">18% reached</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div className="h-full w-[18%] bg-primary progress-glow rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      Monthly Pace
                    </span>
                    <span className="text-sm font-semibold text-amber-400">
                      ₹45,000/mo
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      Est. Completion
                    </span>
                    <span className="text-sm font-semibold">Dec 2026</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-primary text-sm font-bold hover:underline">
                  <span className="material-icons-outlined text-lg">add</span>
                  Add Contribution
                </button>
              </div>
            </div>

            {/* Goal Card 3 */}
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold mb-1">Emergency Fund</h4>
                  <p className="text-sm text-slate-400">
                    Target: <span className="text-slate-200">₹250,000</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                  Ahead
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-300">
                    ₹225,000 saved
                  </span>
                  <span className="text-slate-500">90% reached</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div className="h-full w-[90%] bg-primary progress-glow rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      Monthly Pace
                    </span>
                    <span className="text-sm font-semibold">₹5,000/mo</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      Remaining
                    </span>
                    <span className="text-sm font-semibold">2 months</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-primary text-sm font-bold hover:underline">
                  <span className="material-icons-outlined text-lg">add</span>
                  Add Contribution
                </button>
              </div>
            </div>

            {/* Goal Card 4 */}
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold mb-1">MacBook Pro M3 Max</h4>
                  <p className="text-sm text-slate-400">
                    Target: <span className="text-slate-200">₹350,000</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  On Track
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-300">
                    ₹140,000 saved
                  </span>
                  <span className="text-slate-500">40% reached</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div className="h-full w-[40%] bg-primary progress-glow rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      Monthly Pace
                    </span>
                    <span className="text-sm font-semibold">₹20,000/mo</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      Deadline
                    </span>
                    <span className="text-sm font-semibold">Oct 2024</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-primary text-sm font-bold hover:underline">
                  <span className="material-icons-outlined text-lg">add</span>
                  Add Contribution
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Goal Modal Overlay - Hidden by default but structure kept from UI, we'll hide using 'hidden' class to simulate state. Or we can just render it conditionally later. Let's append 'hidden' so it doesn't block UI for now. */}
      <div className="fixed inset-0 z-50 items-center justify-center p-4 bg-background-dark/80 backdrop-blur-xl hidden">
        <div className="glass-card w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border-slate-700/50">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xl font-bold">Create New Savings Goal</h3>
            <button className="text-slate-500 hover:text-white transition-colors">
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex gap-1 p-1 bg-slate-900/50 rounded-lg border border-slate-800">
              <button className="flex-1 py-1.5 text-xs font-bold rounded-md bg-primary text-white">
                Manual Plan
              </button>
              <button className="flex-1 py-1.5 text-xs font-medium rounded-md text-slate-400 hover:text-slate-200">
                AI Optimized
              </button>
              <button className="flex-1 py-1.5 text-xs font-medium rounded-md text-slate-400 hover:text-slate-200">
                Round-ups
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">
                  Goal Name
                </label>
                <input
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary"
                  type="text"
                  defaultValue="Dream Vacation"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">
                  Target Amount (₹)
                </label>
                <input
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary"
                  type="number"
                  defaultValue="150000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">
                  Initial Deposit (₹)
                </label>
                <input
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary"
                  type="number"
                  defaultValue="8000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">
                  Target Date
                </label>
                <input
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-sm focus:ring-primary"
                  type="date"
                />
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-primary">
                  Live Calculation Preview
                </p>
                <span className="material-icons-outlined text-primary text-sm">
                  calculate
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    Monthly
                  </p>
                  <p className="text-lg font-black text-slate-100">₹11,833</p>
                </div>
                <div className="text-center border-x border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    Daily Pace
                  </p>
                  <p className="text-lg font-black text-slate-100">₹394</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    Duration
                  </p>
                  <p className="text-lg font-black text-slate-100">12 Mo</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-slate-800 flex gap-3">
            <button className="flex-1 py-2.5 rounded-lg border border-slate-700 text-sm font-bold hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button className="flex-[2] py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              Confirm Goal
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
