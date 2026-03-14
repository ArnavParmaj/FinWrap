import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useUserStore } from "../store/useUserStore";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();

  // If already logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex items-center justify-center overflow-hidden p-4 relative z-0">
      {/* Background Elements */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Auth Container */}
      <div className="w-full max-w-[420px] glass-card rounded-2xl p-8 flex flex-col items-center shadow-2xl relative z-10">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="size-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/30">
            <span className="material-icons-outlined text-primary text-3xl">account_balance_wallet</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            FinWrap
          </h1>
          <p className="text-slate-400 text-sm font-light">
            Secure your financial future
          </p>
        </div>

        {error && (
          <div className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        {/* Social Login */}
        <button
          onClick={signInWithGoogle}
          type="button"
          className="bg-white/5 border border-white/10 hover:bg-white/10 w-full h-12 rounded-lg flex items-center justify-center gap-3 text-sm font-medium mb-6 group transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M24 12.27c0-.85-.07-1.74-.22-2.6H12.25v4.92h6.58c-.28 1.48-1.11 2.74-2.35 3.58v2.97h3.81C22.5 19.14 24 16 24 12.27z"
              fill="#EA4335"
            ></path>
            <path
              d="M12.25 24c3.24 0 5.96-1.07 7.94-2.91l-3.81-2.97c-1.06.72-2.42 1.15-4.13 1.15-3.18 0-5.86-2.15-6.82-5.04H1.54v3.12A11.98 11.98 0 0012.25 24z"
              fill="#FBBC05"
            ></path>
            <path
              d="M5.43 14.23c-.24-.72-.38-1.49-.38-2.23s.14-1.51.38-2.23V6.65H1.54a11.98 11.98 0 000 10.7l3.89-3.12z"
              fill="#34A853"
            ></path>
            <path
              d="M12.25 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C18.21 1.17 15.49 0 12.25 0 7.45 0 3.28 2.74 1.54 6.65l3.89 3.12c.96-2.89 3.64-5 6.82-5z"
              fill="#4285F4"
            ></path>
          </svg>
          <span className="text-slate-200">Continue with Google</span>
        </button>

        <div className="w-full flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            OR EMAIL
          </span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleAuth} className="w-full space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 ml-1">
                Full Name
              </label>
              <div className="relative">
                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">person</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border border-white/10 focus:bg-white/10 focus:border-primary/50 w-full h-11 rounded-lg pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all shadow-none"
                  placeholder="Arnav Parma"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 ml-1">
              Email address
            </label>
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 focus:bg-white/10 focus:border-primary/50 w-full h-11 rounded-lg pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all shadow-none"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-slate-400">
                Password
              </label>
              {isLogin && (
                <a
                  href="javascript:void(0)"
                  className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-tight"
                >
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">lock</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border border-white/10 focus:bg-white/10 focus:border-primary/50 w-full h-11 rounded-lg pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all shadow-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-lg shadow-lg shadow-primary/20 transition-all mt-6 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4"
            >
              {isLogin ? "Create account" : "Log in"}
            </button>
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-10 pt-6 border-t border-white/5 w-full flex justify-center gap-6">
          <a
            href="javascript:void(0)"
            className="text-[11px] text-slate-600 hover:text-slate-400"
          >
            Terms
          </a>
          <a
            href="javascript:void(0)"
            className="text-[11px] text-slate-600 hover:text-slate-400"
          >
            Privacy
          </a>
          <a
            href="javascript:void(0)"
            className="text-[11px] text-slate-600 hover:text-slate-400"
          >
            Help
          </a>
        </div>
      </div>
    </div>
  );
}
