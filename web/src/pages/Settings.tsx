import { useState } from "react";
import { useUserStore } from "../store/useUserStore";

export default function SettingsPage() {
  const { user } = useUserStore();
  const [geminiKey, setGeminiKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey) {
      localStorage.setItem("finwrap_gemini_key", geminiKey);
    } else {
      localStorage.removeItem("finwrap_gemini_key");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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

        <div className="glass-card p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold mb-2 text-slate-100 flex items-center gap-2">
            <span className="material-icons-outlined text-primary">psychology</span>
            AI Integration
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Configure your Gemini API key to unlock premium features like Receipt OCR and deep narrative insights on the Wrapped page.
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder={localStorage.getItem("finwrap_gemini_key") ? "••••••••••••••••••••" : "AIzaSy..."}
                className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            
            <button 
              type="submit"
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              {saved ? (
                <>
                  <span className="material-icons-outlined text-[18px]">check</span>
                  Saved
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
