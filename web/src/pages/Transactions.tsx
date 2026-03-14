export default function TransactionsPage() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-primary/10 flex items-center justify-between px-8 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Finances</span>
          <span className="material-icons-outlined text-slate-400 text-sm">chevron_right</span>
          <span className="text-sm font-semibold">Transactions</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              className="bg-primary/5 border-none rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary"
              placeholder="Quick search..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="size-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary/10 transition-colors">
              <span className="material-icons-outlined">notifications</span>
            </button>
            <div className="size-8 rounded-full bg-primary/20 overflow-hidden border border-primary/20">
              <img
                alt="Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ho9AGf88bi_Nf7e4iKtXfdEbLXbZpSZKp63BUgSU91HxfCUR-OiauvhRprh4AyumXqm3WBo4XXfcX7bLCLis1y9LpIzltffhNTkZFXjE0GlRf6EKazePREmojFSsIMZS08y9BEGfYPm85s2GEO2JJbrRyE4HtMKEXdI1zvXAXtpHgaLVdnm9kpgueJ7yzksT6atkcuGe5YGjCOf1yjZ6d-fbnZAJOnZdAPO3OPJ8JGHzAts_JXwxYXYyZRctu9XMU71oXj1reRs"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Transactions
            </h2>
            <p className="text-slate-500  text-sm mt-1">
              Manage and track your global financial movements
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-bold transition-all backdrop-blur-sm">
              <span className="material-icons-outlined text-[18px]">upload_file</span>
              Import CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all">
              <span className="material-icons-outlined text-[18px]">add</span>
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel rounded-2xl p-2 mb-8 flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors text-sm font-medium">
            <span className="material-icons-outlined text-[18px] text-primary">calendar_month</span>
            October 2023
            <span className="material-icons-outlined text-[18px]">expand_more</span>
          </button>
          <div className="h-6 w-px bg-primary/10 mx-1"></div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors text-sm font-medium">
            <span className="material-icons-outlined text-[18px] text-primary">category</span>
            All Categories
            <span className="material-icons-outlined text-[18px]">expand_more</span>
          </button>
          <div className="h-6 w-px bg-primary/10 mx-1"></div>
          <div className="bg-primary/5 rounded-xl p-1 flex gap-1">
            <button className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm">
              All
            </button>
            <button className="px-4 py-1.5 rounded-lg hover:bg-primary/10 text-slate-500 text-xs font-bold transition-colors">
              Debit
            </button>
            <button className="px-4 py-1.5 rounded-lg hover:bg-primary/10 text-slate-500 text-xs font-bold transition-colors">
              Credit
            </button>
          </div>
          <div className="flex-1 flex justify-end px-2">
            <div className="relative w-full max-w-[240px]">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
              <input
                className="w-full bg-transparent border-none text-sm pl-10 focus:ring-0"
                placeholder="Filter merchant..."
                type="text"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-primary/10 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 text-slate-500  text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-12">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary bg-transparent"
                    type="checkbox"
                  />
                </th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              <tr className="hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-4">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary bg-transparent"
                    type="checkbox"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium">Oct 24, 2023</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-slate-100  flex items-center justify-center">
                      <span className="material-icons-outlined text-[20px]">shopping_cart</span>
                    </div>
                    <span className="text-sm font-bold">Apple Store</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
                    Electronics
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-500">
                      Chase Savings
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-rose-500">
                  -$1,299.00
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-1 hover:text-primary transition-colors text-slate-400">
                    <span className="material-icons-outlined">more_horiz</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-4">
                  <input
                    defaultChecked
                    className="rounded border-primary/30 text-primary focus:ring-primary bg-transparent"
                    type="checkbox"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium">Oct 23, 2023</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <span className="material-icons-outlined text-[20px] text-emerald-500">payments</span>
                    </div>
                    <span className="text-sm font-bold">Monthly Salary</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 backdrop-blur-md">
                    Income
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-500">
                      Chase Savings
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-emerald-500">
                  +$5,400.00
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-1 hover:text-primary transition-colors text-slate-400">
                    <span className="material-icons-outlined">more_horiz</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-4">
                  <input
                    className="rounded border-primary/30 text-primary focus:ring-primary bg-transparent"
                    type="checkbox"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium">Oct 22, 2023</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-slate-100  flex items-center justify-center">
                      <span className="material-icons-outlined text-[20px]">local_cafe</span>
                    </div>
                    <span className="text-sm font-bold">Starbucks Coffee</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 backdrop-blur-md">
                    Food & Drink
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-slate-500">
                      Amex Gold Card
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-rose-500">
                  -$12.45
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-1 hover:text-primary transition-colors text-slate-400">
                    <span className="material-icons-outlined">more_horiz</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="p-6 flex items-center justify-between text-sm text-slate-500">
            <p>
              Showing{" "}
              <span className="font-bold text-slate-100 dark:text-slate-100">
                1-3
              </span>{" "}
              of 128 transactions
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/5 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/5">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
