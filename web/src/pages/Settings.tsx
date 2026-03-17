import { useUserStore } from "../store/useUserStore";

export default function SettingsPage() {
  const { user } = useUserStore();

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Settings</h2>

        <div className="glass-card p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold mb-4 text-slate-100 flex items-center gap-2">
            <span className="material-icons-outlined text-primary">account_circle</span>
            Profile Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-slate-300">
                {user?.name || "No name"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-slate-300">
                {user?.email || "No email"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
