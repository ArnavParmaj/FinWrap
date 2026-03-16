import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function TopNav() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pathTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/budgets": "Budgets",
    "/goals": "Goals",
    "/recurring": "Recurring Payments",
    "/splits": "Split Expenses",
    "/insights": "AI Insights",
    "/wrapped": "Monthly Wrapped",
    "/settings": "Settings",
  };

  const currentTitle = pathTitles[location.pathname] || "Overview";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="h-16 border-b border-primary/10 flex items-center justify-between px-8 bg-background-dark/50 backdrop-blur-md z-50 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-slate-400 text-sm">Finances</span>
        <span className="material-icons-outlined text-slate-400 text-sm">
          chevron_right
        </span>
        <span className="text-sm font-semibold text-slate-100">
          {currentTitle}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden sm:block">
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
            search
          </span>
          <input
            className="w-full bg-white/5 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary placeholder:text-slate-500"
            placeholder="Search data..."
            type="text"
          />
        </div>
        
        <button className="size-10 glass-card rounded-full flex items-center justify-center hover:bg-white/10 hidden sm:flex">
          <span className="material-icons-outlined text-slate-400">
            notifications
          </span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-10 rounded-full bg-slate-800 border-2 border-primary/20 overflow-hidden flex items-center justify-center text-sm font-bold text-slate-200 hover:border-primary/50 transition-colors"
          >
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-56 glass-dropdown rounded-xl border border-white/10 shadow-2xl py-2 z-50 flex flex-col">
              <div className="px-4 py-3 border-b border-white/5 mb-1">
                <p className="text-sm font-bold text-slate-100 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || 'No email'}</p>
              </div>
              
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 flex items-center gap-3 transition-colors"
              >
                <span className="material-icons-outlined text-[18px]">settings</span>
                Settings
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-colors mt-1"
              >
                <span className="material-icons-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
