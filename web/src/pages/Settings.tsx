import { useState, useEffect, useRef, useCallback } from "react";
import { useUserStore } from "../store/useUserStore";
import {
  fetchUserSettings,
  updateUserSetting,
  uploadAvatar,
  addAccount,
  updateAccount,
  deleteAccount,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../lib/settingsHelpers";
import type { UserSettings, SettingsAccount, SettingsCategory } from "../types";

// ─── Preset colour swatches for categories ────────────────────────────────────
const PRESET_COLORS = [
  "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#6467f2", "#94a3b8",
  "#ef4444", "#22d3ee", "#a78bfa", "#34d399", "#fb923c",
];

// ─── Toast notification ───────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info";
function Toast({ message, type, onDismiss }: { message: string; type: ToastType; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const bg =
    type === "success" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
    : type === "error"   ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
    : "bg-blue-500/15 border-blue-500/30 text-blue-400";
  const icon =
    type === "success" ? "check_circle" : type === "error" ? "error" : "info";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-[slideUp_.25s_ease] ${bg}`}
    >
      <span className="material-icons-outlined text-lg">{icon}</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100">
        <span className="material-icons-outlined text-base">close</span>
      </button>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}

// ─── Section accordion card ───────────────────────────────────────────────────
function Section({
  icon,
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <span className="material-icons-outlined text-primary">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 text-sm">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <span
          className={`material-icons-outlined text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-white/5 pt-5">{children}</div>
      )}
    </div>
  );
}

// ─── Confirmation modal ───────────────────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
  danger = false,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card border border-white/15 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h4 className="font-semibold text-slate-100 mb-2">{title}</h4>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${
              danger
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-primary hover:bg-primary/80 text-white"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Input helpers ────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">{children}</label>;
}
function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${className}`}
    />
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, updateSettings, fullSettings, setFullSettings } = useUserStore();
  const [settings, setSettingsState] = useState<UserSettings | null>(fullSettings);
  const [loadingSettings, setLoadingSettings] = useState(!fullSettings);

  const setSettings = useCallback((val: React.SetStateAction<UserSettings | null>) => {
    setSettingsState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      setFullSettings(next);
      return next;
    });
  }, [setFullSettings]);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
  }, []);

  // ─── Load settings on mount ────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setLoadingSettings(true);
    fetchUserSettings(user.uid)
      .then((s) => setSettings(s))
      .catch(() => showToast("Failed to load settings", "error"))
      .finally(() => setLoadingSettings(false));
  }, [user, showToast]);

  if (!user) return null;

  // ─── Loading skeleton ──────────────────────────────────────────────────
  if (loadingSettings) {
    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-9 w-40 bg-white/5 rounded-xl animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your profile, preferences and data</p>
        </div>

        <div className="space-y-3">
          {/* 1 ─ Profile Editor */}
          <ProfileSection
            user={user}
            settings={settings!}
            setSettings={setSettings}
            showToast={showToast}
          />

          {/* 2 ─ Theme Toggle */}
          <ThemeSection
            user={user}
            settings={settings!}
            setSettings={setSettings}
            showToast={showToast}
            updateSettings={updateSettings}
          />

          {/* 3 ─ Accounts Manager */}
          <AccountsSection
            user={user}
            settings={settings!}
            setSettings={setSettings}
            showToast={showToast}
          />

          {/* 4 ─ Custom Categories */}
          <CategoriesSection
            user={user}
            settings={settings!}
            setSettings={setSettings}
            showToast={showToast}
          />

          {/* 5 ─ Data & Account */}
          <DataSection showToast={showToast} />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Profile Editor
// ══════════════════════════════════════════════════════════════════════════════
function ProfileSection({
  user,
  settings,
  setSettings,
  showToast,
}: {
  user: { uid: string; name: string; email: string };
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>;
  showToast: (m: string, t?: ToastType) => void;
}) {
  const [displayName, setDisplayName] = useState(settings.displayName || user.name || "");
  const [avatarURL, setAvatarURL] = useState(settings.avatarURL || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5 MB", "error");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadAvatar(user.uid, file);
      setAvatarURL(url);
      setSettings((prev) => prev ? { ...prev, avatarURL: url } : prev);
      showToast("Avatar updated!");
    } catch {
      showToast("Upload failed — check Storage rules", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserSetting(user.uid, "displayName", displayName.trim());
      setSettings((prev) => prev ? { ...prev, displayName: displayName.trim() } : prev);
      
      // Update global user store
      const { user: currentUser, setUser } = useUserStore.getState();
      if (currentUser) {
        setUser({ ...currentUser, name: displayName.trim() });
      }

      showToast("Profile saved!");
    } catch {
      showToast("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const initials = (displayName || user.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Section icon="account_circle" title="Profile" subtitle="Update your display name and avatar" defaultOpen>
      <div className="space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-20 rounded-2xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
              {avatarURL ? (
                <img src={avatarURL} alt="Avatar" className="size-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{initials}</span>
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-colors disabled:opacity-50"
            >
              {uploading ? <Spinner /> : <span className="material-icons-outlined text-base">upload</span>}
              {uploading ? "Uploading…" : "Upload Photo"}
            </button>
            <p className="text-xs text-slate-600 mt-1.5">JPG, PNG or WebP · max 5 MB</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <Label>Display Name</Label>
          <Input
            value={displayName}
            onChange={setDisplayName}
            placeholder="Your name"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <Label>Email Address</Label>
          <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-slate-500 text-sm flex items-center gap-2">
            <span className="material-icons-outlined text-base text-slate-600">lock</span>
            {user.email}
          </div>
          <p className="text-xs text-slate-600 mt-1">Email is managed through your auth provider</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/80 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
        >
          {saving ? <Spinner /> : <span className="material-icons-outlined text-base">save</span>}
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </Section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — Theme Toggle
// ══════════════════════════════════════════════════════════════════════════════
function ThemeSection({
  user,
  settings,
  setSettings,
  showToast,
  updateSettings,
}: {
  user: { uid: string };
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>;
  showToast: (m: string, t?: ToastType) => void;
  updateSettings: (s: Partial<{ theme: "dark" | "light" }>) => void;
}) {
  const [saving, setSaving] = useState(false);
  const isDark = settings.theme === "dark";

  const handleToggle = async () => {
    const newTheme: "dark" | "light" = isDark ? "light" : "dark";
    // Apply immediately
    setSettings((prev) => prev ? { ...prev, theme: newTheme } : prev);
    updateSettings({ theme: newTheme });
    localStorage.setItem("finwrap-theme", newTheme);

    setSaving(true);
    try {
      await updateUserSetting(user.uid, "theme", newTheme);
      showToast(`Switched to ${newTheme} mode`);
    } catch {
      showToast("Couldn't persist theme", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section icon="dark_mode" title="Appearance" subtitle="Toggle between dark and light mode">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-200">Theme</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Currently: <span className="text-slate-300 font-medium capitalize">{settings.theme}</span> mode
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={saving}
          className={`relative w-36 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
            isDark
              ? "bg-slate-800 border-white/10 text-slate-200 hover:bg-slate-700"
              : "bg-amber-500/15 border-amber-500/25 text-amber-400 hover:bg-amber-500/25"
          } disabled:opacity-50`}
        >
          {saving ? (
            <Spinner />
          ) : (
            <span className="material-icons-outlined text-base">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          )}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Visual pills */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div
          onClick={() => settings.theme !== "dark" && handleToggle()}
          className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
            isDark ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 opacity-50"
          }`}
        >
          <div className="h-16 rounded-lg bg-[#080A0F] mb-3 flex items-end p-2">
            <div className="h-2 w-8 bg-primary/70 rounded" />
          </div>
          <div className="flex items-center gap-2">
            {isDark && <span className="material-icons-outlined text-primary text-sm">check_circle</span>}
            <span className="text-xs font-medium text-slate-300">Dark</span>
          </div>
        </div>
        <div
          onClick={() => settings.theme !== "light" && handleToggle()}
          className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
            !isDark ? "border-amber-400 bg-amber-400/10" : "border-white/10 bg-white/5 opacity-50"
          }`}
        >
          <div className="h-16 rounded-lg bg-slate-100 mb-3 flex items-end p-2">
            <div className="h-2 w-8 bg-primary/70 rounded" />
          </div>
          <div className="flex items-center gap-2">
            {!isDark && <span className="material-icons-outlined text-amber-400 text-sm">check_circle</span>}
            <span className="text-xs font-medium text-slate-300">Light</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — Accounts Manager
// ══════════════════════════════════════════════════════════════════════════════
function AccountsSection({
  user,
  settings,
  setSettings,
  showToast,
}: {
  user: { uid: string };
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>;
  showToast: (m: string, t?: ToastType) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("0");
  const [newType, setNewType] = useState<SettingsAccount["type"]>("bank");
  const [addLoading, setAddLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SettingsAccount | null>(null);

  // Local edits per account
  const [edits, setEdits] = useState<Record<string, { name: string; openingBalance: string }>>({});

  const getEdit = (acc: SettingsAccount) =>
    edits[acc.id] ?? { name: acc.name, openingBalance: String(acc.openingBalance) };

  const setEdit = (id: string, field: "name" | "openingBalance", val: string) =>
    setEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { name: "", openingBalance: "0" }), [field]: val },
    }));

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAddLoading(true);
    try {
      const acc = await addAccount(user.uid, {
        name: newName.trim(),
        type: newType,
        openingBalance: parseFloat(newBalance) || 0,
      });
      setSettings((prev) =>
        prev ? { ...prev, accounts: [...prev.accounts, acc] } : prev
      );
      setNewName(""); setNewBalance("0"); setNewType("bank"); setShowAdd(false);
      showToast("Account added!");
    } catch {
      showToast("Failed to add account", "error");
    } finally {
      setAddLoading(false);
    }
  };

  const handleSave = async (acc: SettingsAccount) => {
    const e = getEdit(acc);
    setSavingId(acc.id);
    try {
      const changes = {
        name: e.name.trim() || acc.name,
        openingBalance: parseFloat(e.openingBalance) || 0,
      };
      await updateAccount(user.uid, acc.id, changes);
      setSettings((prev) =>
        prev
          ? { ...prev, accounts: prev.accounts.map((a) => (a.id === acc.id ? { ...a, ...changes } : a)) }
          : prev
      );
      showToast("Account saved!");
    } catch {
      showToast("Failed to save account", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (acc: SettingsAccount) => {
    setDeletingId(acc.id);
    setConfirmDelete(null);
    try {
      await deleteAccount(user.uid, acc.id);
      setSettings((prev) =>
        prev ? { ...prev, accounts: prev.accounts.filter((a) => a.id !== acc.id) } : prev
      );
      showToast("Account removed");
    } catch {
      showToast("Failed to delete account", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const typeIcon = (t: SettingsAccount["type"]) =>
    t === "bank" ? "account_balance" : t === "wallet" ? "account_balance_wallet" : "payments";

  return (
    <>
      <Section icon="account_balance" title="Accounts" subtitle="Manage your bank, wallet and cash accounts">
        <div className="space-y-3">
          {settings.accounts.length === 0 && (
            <p className="text-sm text-slate-500 py-4 text-center">No accounts yet. Add your first one below.</p>
          )}

          {settings.accounts.map((acc) => {
            const e = getEdit(acc);
            return (
              <div key={acc.id} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons-outlined text-base text-slate-400">{typeIcon(acc.type)}</span>
                  <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold">{acc.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Account Name</Label>
                    <Input value={e.name} onChange={(v) => setEdit(acc.id, "name", v)} placeholder="Account name" />
                  </div>
                  <div>
                    <Label>Opening Balance (₹)</Label>
                    <Input
                      type="number"
                      value={e.openingBalance}
                      onChange={(v) => setEdit(acc.id, "openingBalance", v)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleSave(acc)}
                    disabled={savingId === acc.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary/80 hover:bg-primary text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {savingId === acc.id ? <Spinner /> : <span className="material-icons-outlined text-sm">save</span>}
                    Save
                  </button>
                  <button
                    onClick={() => setConfirmDelete(acc)}
                    disabled={deletingId === acc.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20 disabled:opacity-50"
                  >
                    {deletingId === acc.id ? <Spinner /> : <span className="material-icons-outlined text-sm">delete</span>}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add form */}
          {showAdd ? (
            <div className="bg-white/[0.03] border border-primary/20 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">New Account</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input value={newName} onChange={setNewName} placeholder="e.g. SBI Savings" />
                </div>
                <div>
                  <Label>Opening Balance (₹)</Label>
                  <Input type="number" value={newBalance} onChange={setNewBalance} placeholder="0" />
                </div>
              </div>
              <div>
                <Label>Type</Label>
                <div className="flex gap-2">
                  {(["bank", "wallet", "cash"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewType(t)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        newType === t
                          ? "bg-primary/20 border-primary/40 text-primary"
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="material-icons-outlined text-sm">{typeIcon(t)}</span>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAdd}
                  disabled={addLoading || !newName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-primary hover:bg-primary/80 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {addLoading ? <Spinner /> : <span className="material-icons-outlined text-base">add</span>}
                  Add Account
                </button>
                <button
                  onClick={() => { setShowAdd(false); setNewName(""); setNewBalance("0"); }}
                  className="px-4 py-2 text-sm rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-400 hover:text-slate-200 border border-dashed border-white/10 hover:border-primary/30 rounded-xl transition-all hover:bg-primary/5"
            >
              <span className="material-icons-outlined text-base">add</span>
              Add Account
            </button>
          )}
        </div>
      </Section>

      {confirmDelete && (
        <ConfirmModal
          title="Delete Account"
          message={`Are you sure you want to remove "${confirmDelete.name}"? This cannot be undone.`}
          danger
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — Custom Categories Editor
// ══════════════════════════════════════════════════════════════════════════════
function CategoriesSection({
  user,
  settings,
  setSettings,
  showToast,
}: {
  user: { uid: string };
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings | null>>;
  showToast: (m: string, t?: ToastType) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [addLoading, setAddLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SettingsCategory | null>(null);

  // Local edits per category
  const [edits, setEdits] = useState<Record<string, { name: string; color: string }>>({});

  const getEdit = (cat: SettingsCategory) => edits[cat.id] ?? { name: cat.name, color: cat.color };
  const setEdit = (id: string, field: "name" | "color", val: string) =>
    setEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { name: "", color: "#6467f2" }), [field]: val },
    }));

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAddLoading(true);
    try {
      const cat = await addCategory(user.uid, {
        name: newName.trim(),
        color: newColor,
        isCustom: true,
      });
      setSettings((prev) =>
        prev ? { ...prev, categories: [...prev.categories, cat] } : prev
      );
      setNewName(""); setNewColor(PRESET_COLORS[0]); setShowAdd(false);
      showToast("Category added!");
    } catch {
      showToast("Failed to add category", "error");
    } finally {
      setAddLoading(false);
    }
  };

  const handleSave = async (cat: SettingsCategory) => {
    const e = getEdit(cat);
    setSavingId(cat.id);
    try {
      const changes = { name: e.name.trim() || cat.name, color: e.color };
      await updateCategory(user.uid, cat.id, changes);
      setSettings((prev) =>
        prev
          ? { ...prev, categories: prev.categories.map((c) => (c.id === cat.id ? { ...c, ...changes } : c)) }
          : prev
      );
      showToast("Category saved!");
    } catch {
      showToast("Failed to save category", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (cat: SettingsCategory) => {
    setDeletingId(cat.id);
    setConfirmDelete(null);
    try {
      await deleteCategory(user.uid, cat.id);
      setSettings((prev) =>
        prev ? { ...prev, categories: prev.categories.filter((c) => c.id !== cat.id) } : prev
      );
      showToast("Category removed");
    } catch {
      showToast("Failed to delete category", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Section icon="label" title="Categories" subtitle="Manage spending categories and their colours">
        <div className="space-y-2">
          {settings.categories.map((cat) => {
            const e = getEdit(cat);
            const isDefault = !cat.isCustom;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3"
              >
                {/* Color swatch / picker */}
                <div className="relative flex-shrink-0">
                  <div
                    className="size-8 rounded-lg border-2 border-white/20 cursor-pointer shadow-inner"
                    style={{ background: e.color }}
                    title="Click to change colour"
                  />
                  {!isDefault && (
                    <input
                      type="color"
                      value={e.color}
                      onChange={(ev) => setEdit(cat.id, "color", ev.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer size-full"
                    />
                  )}
                </div>

                {/* Name input */}
                <input
                  value={e.name}
                  onChange={(ev) => setEdit(cat.id, "name", ev.target.value)}
                  disabled={isDefault}
                  className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none disabled:opacity-50 disabled:cursor-default"
                  placeholder="Category name"
                />

                {isDefault && (
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 px-2 py-0.5 rounded border border-white/10">
                    default
                  </span>
                )}

                {/* Colour preset pills (only for custom) */}
                {!isDefault && (
                  <div className="hidden sm:flex gap-1">
                    {PRESET_COLORS.slice(0, 5).map((c) => (
                      <button
                        key={c}
                        onClick={() => setEdit(cat.id, "color", c)}
                        className={`size-4 rounded-full border-2 transition-transform hover:scale-110 ${
                          e.color === c ? "border-white scale-110" : "border-transparent"
                        }`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                )}

                {/* Save / Delete */}
                {!isDefault && (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleSave(cat)}
                      disabled={savingId === cat.id}
                      className="size-8 flex items-center justify-center rounded-lg bg-primary/20 hover:bg-primary/40 text-primary transition-colors disabled:opacity-50"
                      title="Save"
                    >
                      {savingId === cat.id ? <Spinner /> : <span className="material-icons-outlined text-sm">save</span>}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(cat)}
                      disabled={deletingId === cat.id}
                      className="size-8 flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-colors border border-rose-500/20 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === cat.id ? <Spinner /> : <span className="material-icons-outlined text-sm">delete</span>}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add new category */}
          {showAdd ? (
            <div className="bg-white/[0.03] border border-primary/20 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">New Category</p>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    className="size-9 rounded-lg border-2 border-white/20 shadow-inner cursor-pointer"
                    style={{ background: newColor }}
                  />
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer size-full"
                  />
                </div>
                <Input value={newName} onChange={setNewName} placeholder="Category name" />
              </div>
              {/* Preset swatches */}
              <div className="flex flex-wrap gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`size-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      newColor === c ? "border-white scale-125" : "border-transparent"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={addLoading || !newName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-primary hover:bg-primary/80 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {addLoading ? <Spinner /> : <span className="material-icons-outlined text-base">add</span>}
                  Add Category
                </button>
                <button
                  onClick={() => { setShowAdd(false); setNewName(""); }}
                  className="px-4 py-2 text-sm rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-400 hover:text-slate-200 border border-dashed border-white/10 hover:border-primary/30 rounded-xl transition-all hover:bg-primary/5"
            >
              <span className="material-icons-outlined text-base">add</span>
              Add Custom Category
            </button>
          )}
        </div>
      </Section>

      {confirmDelete && (
        <ConfirmModal
          title="Delete Category"
          message={`Remove "${confirmDelete.name}"? Existing transactions using this category will keep their label.`}
          danger
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — Data & Account
// ══════════════════════════════════════════════════════════════════════════════
function DataSection({ showToast }: { showToast: (m: string, t?: ToastType) => void }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Section icon="manage_accounts" title="Data & Account" subtitle="Export your data or delete your account">
        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-start justify-between p-4 bg-white/[0.02] border border-white/8 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-200">Export Data</p>
              <p className="text-xs text-slate-500 mt-0.5">Download all your transactions as CSV</p>
            </div>
            <button
              onClick={() => showToast("Export coming soon — stay tuned!", "info")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 transition-colors"
            >
              <span className="material-icons-outlined text-base">download</span>
              Export
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-start justify-between p-4 bg-rose-500/5 border border-rose-500/15 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-rose-400">Delete Account</p>
              <p className="text-xs text-rose-400/60 mt-0.5 max-w-xs">
                Permanently delete your account and all associated data. This action is irreversible.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 rounded-xl text-rose-400 transition-colors flex-shrink-0"
            >
              <span className="material-icons-outlined text-base">delete_forever</span>
              Delete
            </button>
          </div>
        </div>
      </Section>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Account?"
          message="This feature is currently disabled for safety. Account deletion will be available in a future update. Your data remains fully private and secure."
          danger={false}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setShowDeleteModal(false);
            showToast("Account deletion is not yet available", "info");
          }}
        />
      )}
    </>
  );
}
