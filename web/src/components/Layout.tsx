import { useLocation, Outlet, Link } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (target: string) => {
    const isActive = path.startsWith(target);
    return isActive
      ? "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white font-medium transition-all"
      : "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-dark font-display text-slate-100 aurora-bleed">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 glass-card border-r border-slate-200/10 h-full flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-icons-outlined">payments</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">
              FinWrap
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Personal Finance
            </p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link to="/dashboard" className={getLinkClass("/dashboard")}>
            <span className="material-icons-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link to="/transactions" className={getLinkClass("/transactions")}>
            <span className="material-icons-outlined">receipt_long</span>
            <span className="text-sm">Transactions</span>
          </Link>
          <Link to="/budgets" className={getLinkClass("/budgets")}>
            <span className="material-icons-outlined">
              account_balance_wallet
            </span>
            <span className="text-sm">Budgets</span>
          </Link>
          <Link to="/goals" className={getLinkClass("/goals")}>
            <span className="material-icons-outlined">track_changes</span>
            <span className="text-sm">Goals</span>
          </Link>
          <Link to="/recurring" className={getLinkClass("/recurring")}>
            <span className="material-icons-outlined">sync</span>
            <span className="text-sm">Recurring</span>
          </Link>
          <Link to="/splits" className={getLinkClass("/splits")}>
            <span className="material-icons-outlined">call_split</span>
            <span className="text-sm">Splits</span>
          </Link>
          <Link to="/insights" className={getLinkClass("/insights")}>
            <span className="material-icons-outlined">bar_chart</span>
            <span className="text-sm">Insights</span>
          </Link>
          <Link to="/wrapped" className={getLinkClass("/wrapped")}>
            <span className="material-icons-outlined">card_giftcard</span>
            <span className="text-sm">Wrapped</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all">
            <span className="material-icons-outlined text-sm">stars</span>
            Premium Plan
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <Outlet />
    </div>
  );
}
