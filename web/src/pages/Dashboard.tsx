import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useTransactions } from "../hooks/useTransactions";
import { useBudgets } from "../hooks/useBudgets";
import { useGoals } from "../hooks/useGoals";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useAppStore } from "../store/useAppStore";
import {
  computeDashboardStats,
  pctChange,
  formatINR,
  getPrevMonth,
  formatMonthLabel,
} from "../lib/dashboardStats";

// Month navigation helpers
const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
});

function PctBadge({
  current,
  previous,
  inverted = false,
}: {
  current: number;
  previous: number;
  inverted?: boolean;
}) {
  const pct = pctChange(current, previous);
  const isPositive = inverted ? pct < 0 : pct >= 0;
  return (
    <p
      className={`text-xs font-semibold mt-1 flex items-center gap-1 ${isPositive ? "text-emerald-500" : "text-rose-500"}`}
    >
      <span className="material-icons-outlined text-xs">
        {isPositive ? "trending_up" : "trending_down"}
      </span>
      {pct >= 0 ? "+" : ""}
      {pct.toFixed(1)}%
    </p>
  );
}

function StatCard({
  label,
  value,
  borderColor,
  current,
  previous,
  inverted = false,
}: {
  label: string;
  value: string;
  borderColor: string;
  current: number;
  previous: number;
  inverted?: boolean;
}) {
  return (
    <div
      className={`glass-card p-5 rounded-xl border-l-4 ${borderColor} shadow-sm hover:translate-y-[-2px] transition-transform`}
    >
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </p>
      <h3 className="text-2xl font-bold mt-1 text-slate-100">{value}</h3>
      <PctBadge current={current} previous={previous} inverted={inverted} />
    </div>
  );
}

const DONUT_COLORS = [
  "#6366f1", // Indigo
  "#22d3ee", // Cyan
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#a78bfa", // Purple
  "#34d399", // Green
  "#38bdf8", // Sky
  "#fb923c", // Orange
  "#e879f9", // Fuchsia
];

export default function DashboardPage() {
  const { activeMonth, setActiveMonth } = useAppStore();
  const prevMonth = getPrevMonth(activeMonth);

  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const { transactions: currentTx, loading: loadingCurrent } =
    useTransactions(activeMonth);
  const { transactions: prevTx } = useTransactions(prevMonth);
  const { budgets } = useBudgets(activeMonth);
  const { goals } = useGoals();
  const { subscriptions } = useSubscriptions();

  // Dynamic Category Map Builder
  const dynamicCatMap = useMemo(() => {
    const map: Record<string, { name: string; color: string }> = {};
    const usedColors = new Set<string>();
    
    currentTx.forEach(tx => {
      if (!tx.categoryId) return;
      if (!map[tx.categoryId]) {
        // Pick the next available color from DONUT_COLORS
        const color = DONUT_COLORS.find(c => !usedColors.has(c)) || DONUT_COLORS[Math.floor(Math.random() * DONUT_COLORS.length)];
        usedColors.add(color);
        map[tx.categoryId] = {
           name: tx.categoryId.charAt(0).toUpperCase() + tx.categoryId.slice(1).replace(/_/g, " "),
           color
        };
      }
    });
    return map;
  }, [currentTx]);

  // Opening balance computation (Basic heuristic for now: current transactions total delta)
  // To truly compute opening balance, we would need all past transactions before the activeMonth.
  // For UI representation, we'll keep it at 0 until we implement a running ledger.
  const openingBalance = 0;
  const prevOpeningBalance = 0;

  const stats = useMemo(
    () =>
      computeDashboardStats(
        currentTx,
        prevTx,
        subscriptions,
        goals,
        openingBalance,
        prevOpeningBalance,
        budgets,
        dynamicCatMap,
      ),
    [currentTx, prevTx, subscriptions, goals, budgets, openingBalance, prevOpeningBalance, dynamicCatMap],
  );

  // Build category breakdown with fallback colors
  const donutData = useMemo(
    () =>
      stats.categoryBreakdown.map((c, i) => ({
        ...c,
        color:
          c.color && c.color !== "#6366f1"
            ? c.color
            : DONUT_COLORS[i % DONUT_COLORS.length],
      })),
    [stats.categoryBreakdown],
  );

  // Recharts daily bar data formatted with short-date labels
  const barData = useMemo(
    () =>
      stats.dailySpend.map((d) => ({
        name: d.date.slice(5), // "MM-DD"
        amount: d.amount,
      })),
    [stats.dailySpend],
  );

  const isEmpty = !loadingCurrent && currentTx.length === 0;

  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      <div className="p-8 space-y-6">
        {/* Month Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-100">
            Overview
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowMonthPicker((v) => !v)}
              className="flex items-center gap-2 hover:text-primary px-3 py-1.5 rounded-full bg-white/5 text-sm font-medium transition-colors"
            >
              <span>{formatMonthLabel(activeMonth)}</span>
              <span className="material-icons-outlined text-sm">
                expand_more
              </span>
            </button>
            {showMonthPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMonthPicker(false)} />
                <div className="absolute top-10 right-0 glass-dropdown rounded-xl border border-white/10 z-50 w-48 py-1 shadow-2xl">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setActiveMonth(m);
                        setShowMonthPicker(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${m === activeMonth ? "text-primary font-semibold" : "text-slate-300"}`}
                    >
                      {formatMonthLabel(m)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {loadingCurrent ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass-card p-5 rounded-xl h-28 animate-pulse bg-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              label="Opening Balance"
              value={formatINR(stats.openingBalance)}
              borderColor="border-l-primary"
              current={stats.openingBalance}
              previous={stats.prevOpeningBalance}
            />
            <StatCard
              label="Total Credited"
              value={formatINR(stats.totalCredited)}
              borderColor="border-l-emerald-500"
              current={stats.totalCredited}
              previous={stats.prevTotalCredited}
            />
            <StatCard
              label="Total Debited"
              value={formatINR(stats.totalDebited)}
              borderColor="border-l-rose-500"
              current={stats.totalDebited}
              previous={stats.prevTotalDebited}
              inverted
            />
            <StatCard
              label="Net Savings"
              value={formatINR(stats.netSavings)}
              borderColor="border-l-blue-400"
              current={stats.netSavings}
              previous={stats.prevNetSavings}
            />
            <StatCard
              label="Investments"
              value={formatINR(stats.investments)}
              borderColor="border-l-purple-400"
              current={stats.investments}
              previous={stats.prevInvestments}
            />
            <StatCard
              label="Closing Balance"
              value={formatINR(stats.closingBalance)}
              borderColor="border-l-white/20"
              current={stats.closingBalance}
              previous={stats.prevClosingBalance}
            />
          </div>
        )}

        {/* Budget Alert */}
        {stats.topBudgetAlert && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-icons-outlined">warning</span>
              <p className="text-sm font-medium">
                Budget Alert: You have spent{" "}
                <span className="font-bold">
                  {stats.topBudgetAlert.percent}%
                </span>{" "}
                of your &quot;
                {stats.topBudgetAlert.categoryName}&quot; budget for{" "}
                {formatMonthLabel(activeMonth)}.
              </p>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-bold uppercase tracking-wider bg-amber-500 text-background-dark px-4 py-1.5 rounded-lg hover:bg-amber-400 transition-colors inline-block"
            >
              Adjust Budget
            </Link>
          </div>
        )}

        {isEmpty ? (
          /* Empty state */
          <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
            <span className="material-icons-outlined text-5xl text-slate-600">
              receipt_long
            </span>
            <h3 className="text-lg font-semibold text-slate-300">
              No transactions yet
            </h3>
            <p className="text-slate-500 text-sm max-w-sm">
              Import a bank CSV or add transactions manually to see your
              financial overview here.
            </p>
            <Link
              to="/transactions"
              className="mt-2 px-5 py-2 bg-primary rounded-lg text-sm font-semibold hover:bg-primary/80 transition-colors inline-block"
            >
              Add Transactions
            </Link>
          </div>
        ) : (
          /* Charts */
          <div className="grid grid-cols-12 gap-6">
            {/* Daily Spend Bar Chart */}
            <div className="col-span-12 lg:col-span-8 glass-card p-6 rounded-2xl">
              <h4 className="text-sm font-semibold text-slate-300 mb-4">
                Daily Spending — {formatMonthLabel(activeMonth)}
              </h4>
              {barData.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-slate-600 text-sm">
                  No debit data this month
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={barData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "none",
                        borderRadius: 8,
                        color: "#f1f5f9",
                        fontSize: 12,
                      }}
                      formatter={(v) => [formatINR(Number(v ?? 0)), "Spent"]}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Donut */}
            <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-2xl">
              <h4 className="text-sm font-semibold text-slate-300 mb-4">
                Spending by Category
              </h4>
              {donutData.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-slate-600 text-sm">
                  No category data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(val) => (
                        <span style={{ color: "#94a3b8", fontSize: 11 }}>
                          {val}
                        </span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "none",
                        borderRadius: 8,
                        color: "#f1f5f9",
                        fontSize: 12,
                      }}
                      formatter={(v) => [formatINR(Number(v ?? 0)), "Spent"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
