export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      {/* Top Bar */}
      <header className="h-16 glass-card border-b border-white/5 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold tracking-tight">Overview</h2>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button className="flex items-center gap-2 hover:text-primary px-3 py-1.5 rounded-full bg-white/5 transition-colors">
              <span>January 2024</span>
              <span className="material-icons-outlined text-sm">expand_more</span>
            </button>
            <button className="flex items-center gap-2 hover:text-primary px-3 py-1.5 rounded-full bg-white/5 transition-colors">
              <span>All Accounts</span>
              <span className="material-icons-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
            <input
              className="w-full bg-white/5 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary placeholder:text-slate-500"
              placeholder="Search data..."
              type="text"
            />
          </div>
          <button className="size-10 glass-card rounded-full flex items-center justify-center hover:bg-white/10">
            <span className="material-icons-outlined text-slate-400">notifications</span>
          </button>
          <button className="size-10 glass-card rounded-full flex items-center justify-center hover:bg-white/10">
            <span className="material-icons-outlined text-slate-400">settings</span>
          </button>
          <div className="size-10 rounded-full bg-slate-800 border-2 border-primary/20 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="User profile avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj0yfVzE5QtiiL9-PhWOD098lWdIP44thJNbd4lGa4ro4uQ73H5v7JFtHECQVRfpI9_co0OQWOJKJzkfGMr_PHDTxF2N2hz4we_6Lpy2N7s3kztxxynGaw-DYIaKOhXU9iP3t7cKqVbfcRSNHXZszGz5Eiq0mfiayQodd1Q1NSrGrSvFctCEwjuaA1EuYPVmczcVxnjOcjaZtaXc9MwDWVtF5uzlszkjFjFGxIJoxeWPlUVlwLgecmCWXA0otW_cwWN3zmIl-vkQY"
            />
          </div>
        </div>
      </header>
      <div className="p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="glass-card p-5 rounded-xl border-l-4 border-l-primary shadow-sm hover:translate-y-[-2px] transition-transform">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Opening Balance
            </p>
            <h3 className="text-2xl font-bold mt-1">₹1,42,000</h3>
            <p className="text-emerald-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <span className="material-icons-outlined text-xs">trending_up</span>{" "}
              +5.2%
            </p>
          </div>
          <div className="glass-card p-5 rounded-xl border-l-4 border-l-emerald-500 shadow-sm hover:translate-y-[-2px] transition-transform">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Total Credited
            </p>
            <h3 className="text-2xl font-bold mt-1">₹85,000</h3>
            <p className="text-emerald-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <span className="material-icons-outlined text-xs">trending_up</span>{" "}
              +12.1%
            </p>
          </div>
          <div className="glass-card p-5 rounded-xl border-l-4 border-l-rose-500 shadow-sm hover:translate-y-[-2px] transition-transform">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Total Debited
            </p>
            <h3 className="text-2xl font-bold mt-1">₹42,000</h3>
            <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <span className="material-icons-outlined text-xs">trending_down</span>{" "}
              -2.1%
            </p>
          </div>
          <div className="glass-card p-5 rounded-xl border-l-4 border-l-blue-400 shadow-sm hover:translate-y-[-2px] transition-transform">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Net Savings
            </p>
            <h3 className="text-2xl font-bold mt-1">₹43,000</h3>
            <p className="text-emerald-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <span className="material-icons-outlined text-xs">trending_up</span>{" "}
              +12.3%
            </p>
          </div>
          <div className="glass-card p-5 rounded-xl border-l-4 border-l-purple-400 shadow-sm hover:translate-y-[-2px] transition-transform">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Investments
            </p>
            <h3 className="text-2xl font-bold mt-1">₹25,000</h3>
            <p className="text-emerald-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <span className="material-icons-outlined text-xs">trending_up</span>{" "}
              +4.0%
            </p>
          </div>
          <div className="glass-card p-5 rounded-xl border-l-4 border-l-white/20 shadow-sm hover:translate-y-[-2px] transition-transform">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Closing Balance
            </p>
            <h3 className="text-2xl font-bold mt-1">₹1,85,000</h3>
            <p className="text-emerald-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <span className="material-icons-outlined text-xs">trending_up</span>{" "}
              +6.8%
            </p>
          </div>
        </div>

        {/* Alert Strip */}
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-icons-outlined">warning</span>
            <p className="text-sm font-medium">
              Budget Alert: You have spent{" "}
              <span className="font-bold">92%</span> of your "Dining" budget for
              January.
            </p>
          </div>
          <button className="text-xs font-bold uppercase tracking-wider bg-amber-500 text-background-dark px-4 py-1.5 rounded-lg hover:bg-amber-400 transition-colors">
            Adjust Budget
          </button>
        </div>

        {/* Placeholder for charts for now to fit in size */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 glass-card p-6 rounded-2xl flex flex-col items-center justify-center h-64">
            <p className="text-slate-500 font-medium">
              Daily Spend Chart Component placeholder
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-2xl flex flex-col items-center justify-center h-64">
            <p className="text-slate-500 font-medium">
              Donut Chart Component placeholder
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
