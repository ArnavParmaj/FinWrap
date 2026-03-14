export default function BudgetsPage() {
  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200  flex items-center justify-between px-8 glass-card sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              className="w-full bg-slate-100 dark:bg-slate-900/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-500"
              placeholder="Search budgets or categories..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
            <span className="material-icons-outlined">notifications</span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200  mx-2"></div>
          <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 rounded-full border border-primary/20"
              alt="User profile avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFuMNAQp6JLmuUWuhCTwPlXYHBXk2FAjz2ol0iIoJU1hIo67GQFaMGenOk2m0rrB5YIIho46oOEc0Bap1rfybUuoYIhJFXz4O2cVSVUZRoNNCtksHPcpnAZ62_ZM9KkBn1fqSskwekNNf8qSIJ_ZdtUgdHJPazHyNV6HuQdW8zN_B6S9ooeHAkzHw77ICKZO3kkPWURaSDKQHPjGZv5NjSIsqKt0mrEEen_3oJnLTLJBP0RUzRnQ-QG4189yItDop5k8YNRAFLjy8"
            />
            <span className="text-sm font-semibold">Alex Chen</span>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-100 dark:text-white">
              Budget Goals
            </h2>
            <p className="text-slate-500  mt-1">
              Manage your monthly spending limits and savings.
            </p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 transition-all">
            <span className="material-icons-outlined">add</span>
            Add Budget
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex border-b border-slate-200  gap-8 overflow-x-auto">
          <a
            className="px-2 py-4 text-sm font-bold text-primary border-b-2 border-primary whitespace-nowrap"
            href="javascript:void(0)"
          >
            October 2023
          </a>
          <a
            className="px-2 py-4 text-sm font-medium text-slate-500  hover:text-slate-100 dark:hover:text-slate-100 whitespace-nowrap transition-all"
            href="javascript:void(0)"
          >
            November 2023
          </a>
          <a
            className="px-2 py-4 text-sm font-medium text-slate-500  hover:text-slate-100 dark:hover:text-slate-100 whitespace-nowrap transition-all"
            href="javascript:void(0)"
          >
            December 2023
          </a>
          <a
            className="px-2 py-4 text-sm font-medium text-slate-500  hover:text-slate-100 dark:hover:text-slate-100 whitespace-nowrap transition-all"
            href="javascript:void(0)"
          >
            January 2024
          </a>
        </div>
      </div>

      {/* Budget Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Dining & Drinks */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300 group">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center">
              <span className="material-icons-outlined text-3xl">restaurant</span>
            </div>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Rollover On
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100  mb-1">
              Dining & Drinks
            </h3>
            <p className="text-2xl font-black text-emerald-400">₹900 left</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>₹2,100 spent</span>
              <span>₹3,000 budget</span>
            </div>
            <div className="h-3 w-full bg-slate-200  rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[70%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ₹2,100 spent of ₹3,000
            </p>
          </div>
        </div>

        {/* Card 2: Groceries */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center">
              <span className="material-icons-outlined text-3xl">shopping_cart</span>
            </div>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Rollover On
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100  mb-1">
              Groceries
            </h3>
            <p className="text-2xl font-black text-amber-400">₹300 left</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>₹2,700 spent</span>
              <span>₹3,000 budget</span>
            </div>
            <div className="h-3 w-full bg-slate-200  rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[90%] shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ₹2,700 spent of ₹3,000
            </p>
          </div>
        </div>

        {/* Card 3: Travel */}
        <div className="glass-card border border-rose-500/40 rounded-2xl p-6 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center">
              <span className="material-icons-outlined text-3xl">flight</span>
            </div>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Rollover On
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100  mb-1">
              Travel
            </h3>
            <p className="text-2xl font-black text-rose-400">-₹500 left</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>₹3,500 spent</span>
              <span>₹3,000 budget</span>
            </div>
            <div className="h-3 w-full bg-slate-200  rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-full shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ₹3,500 spent of ₹3,000
            </p>
          </div>
        </div>

        {/* Card 4: Entertainment */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-indigo-500/20 text-indigo-500 rounded-2xl flex items-center justify-center">
              <span className="material-icons-outlined text-3xl">movie</span>
            </div>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Rollover On
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100  mb-1">
              Entertainment
            </h3>
            <p className="text-2xl font-black text-emerald-400">₹1,200 left</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>₹800 spent</span>
              <span>₹2,000 budget</span>
            </div>
            <div className="h-3 w-full bg-slate-200  rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[40%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ₹800 spent of ₹2,000
            </p>
          </div>
        </div>

        {/* Card 5: Subscriptions */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-sky-500/20 text-sky-500 rounded-2xl flex items-center justify-center">
              <span className="material-icons-outlined text-3xl">calendar_today</span>
            </div>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Rollover On
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100  mb-1">
              Subscriptions
            </h3>
            <p className="text-2xl font-black text-amber-400">₹150 left</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>₹1,350 spent</span>
              <span>₹1,500 budget</span>
            </div>
            <div className="h-3 w-full bg-slate-200  rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[90%] shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ₹1,350 spent of ₹1,500
            </p>
          </div>
        </div>

        {/* Card 6: Health & Wellness */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center">
              <span className="material-icons-outlined text-3xl">fitness_center</span>
            </div>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Rollover On
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100  mb-1">
              Health & Wellness
            </h3>
            <p className="text-2xl font-black text-emerald-400">₹2,400 left</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>₹1,600 spent</span>
              <span>₹4,000 budget</span>
            </div>
            <div className="h-3 w-full bg-slate-200  rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[40%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ₹1,600 spent of ₹4,000
            </p>
          </div>
        </div>
      </div>

      {/* Footer-ish info */}
      <div className="px-8 pb-12">
        <div className="glass-card rounded-2xl p-6 border-primary/20 bg-primary/5 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-icons-outlined text-3xl">info</span>
          </div>
          <div>
            <h4 className="font-bold text-lg">Budget Optimization</h4>
            <p className="text-slate-500  text-sm">
              You've saved ₹4,500 compared to last month across all categories.
              Your savings goal for this month is 85% complete.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
