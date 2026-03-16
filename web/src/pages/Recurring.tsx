export default function RecurringPage() {
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
              ₹4,850
              <span className="text-2xl font-normal text-slate-500">/mo</span>
            </h1>
            <p className="mt-4 text-slate-400 max-w-md">
              Your projected expenses for the next 30 days based on active
              subscriptions and detected bills.
            </p>
          </div>
        </div>

        {/* Subscriptions List Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-bold">Active Subscriptions</h3>
          <div className="flex gap-2">
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all">
              <span className="material-icons-outlined text-sm">add</span>
              New Sub
            </button>
            <button className="px-4 py-2 rounded-lg glass-card text-sm font-medium hover:bg-white/10">
              Filter
            </button>
            <button className="px-4 py-2 rounded-lg glass-card text-sm font-medium hover:bg-white/10">
              Export
            </button>
          </div>
        </div>

        {/* List of Cards */}
        <div className="space-y-4">
          {/* Netflix Card */}
          <div className="glass-card p-5 rounded-2xl flex items-center gap-6 group hover:border-primary/40 transition-all">
            <div className="size-14 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center p-2">
              <img
                alt="Netflix"
                className="w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP35mQR2tRM22TJXCqTjuAMKn12qH7ZtZ1xLvGau1VxLUEi0mR2DtcdEYF_Omqh9g9Qe-_FW5qmoZ3rSybGgE8zGUZh9J68vWq1qMGGPADoxKco57QCvddKJcruKEzijoPPcwxfs_4FmbzJEuTMvRAnJH118w4207s5Kujoeb_t65P4mOMILYdMJNqK5RvHS4zySEFR6_JOSa602GeN9FAize35jEYFU8aKUHgiJJzLUjQZZ6fxbyenwvo8HaL6zkUR1WCZBv06Ps"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg truncate">Netflix Premium</h4>
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Auto
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Entertainment
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">calendar_today</span>{" "}
                  Next: May 12
                </span>
              </div>
            </div>
            <div className="text-right px-6">
              <p className="text-xl font-bold text-white">₹649</p>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                Monthly
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-emerald-500/10 text-emerald-500 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/20">
                Detected
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  defaultChecked
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Notion Card */}
          <div className="glass-card p-5 rounded-2xl flex items-center gap-6 group hover:border-primary/40 transition-all">
            <div className="size-14 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center p-2">
              <img
                alt="Notion"
                className="w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEN3osm6YXmx2-qxPHc0bAJ1qcpuLMhTpVBuXS_aK_JBVlF1V4lijG3gWCzKcRMW4YZFYdW5qg6nbayr-fKC28P8Y7mWJmH7fSYXyq3J04EZBcg_p55za8i2sB0vFfCqeYChZQ_BUHvkd-CRDbj9hM8nOMS8Wy73LP4cBwbobtdKLdQVFI7mKe29lCYWWfLTednI9DFs95PU7KAuhhd44RvodLwlCsaRQnP4nQeq8rnv81aGUobuy41QhbyUSD0ngD5ufdzvqaX94"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg truncate">Notion Pro</h4>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Productivity
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">calendar_today</span>{" "}
                  Next: May 18
                </span>
              </div>
            </div>
            <div className="text-right px-6">
              <p className="text-xl font-bold text-white">₹820</p>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                Monthly
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-amber-500/10 text-amber-500 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-500/20">
                Due in 4 days
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  defaultChecked
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Spotify Card */}
          <div className="glass-card p-5 rounded-2xl flex items-center gap-6 group hover:border-primary/40 transition-all">
            <div className="size-14 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center p-2">
              <img
                alt="Spotify"
                className="w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhYE4oeMWQ1fHN1HI4WOhhVxiIYMiV4rsGZMAMs2QaAuHaJYVN0KQOsZlUoFA7fe8wWTzfiylUXaL7HBh55CrB2oMBIGq229V2YGQWJXFIAs1oA_W0h7F-UB9eLiV3HoQbOEF5pXn51UhERwzEHSk0yn3doJ02VGCzgOPSIYnOVLPzCl9YtoiFw7HFk9dI5YU537Gw3yijX8xjxOVL3X3KXLVNyilAjx3xzSM99EGwhQiy8UlB9vlMG0xcNTx4yea-hEH6XQV2YG8"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg truncate">Spotify Family</h4>
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Auto
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Music
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-medium">
                  <span className="material-icons-outlined text-sm">error</span>{" "}
                  Missing Payment
                </span>
              </div>
            </div>
            <div className="text-right px-6">
              <p className="text-xl font-bold text-white">₹179</p>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                Monthly
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-rose-500/10 text-rose-500 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/20">
                Missing
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Additional View Actions */}
        <div className="mt-8 flex justify-center">
          <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors py-4">
            <span className="text-sm font-medium">
              View Archived Subscriptions
            </span>
            <span className="material-icons-outlined">expand_more</span>
          </button>
        </div>
      </div>
    </main>
  );
}
