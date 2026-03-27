import { useState } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AuthModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState("");

  async function handleOAuth(provider) {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  async function handleMagicLink(e) {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setMagicLinkSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold text-text mb-1">Sign in to sync</h2>
        <p className="text-sm text-text-muted mb-6">
          Your progress syncs across all devices when signed in.
        </p>

        {magicLinkSent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle size={40} className="text-easy" />
            <p className="text-text font-medium">Check your email</p>
            <p className="text-sm text-text-muted">
              We sent a magic link to <span className="text-text">{email}</span>
            </p>
            <button onClick={onClose} className="mt-2 text-sm text-primary-light hover:underline">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* OAuth buttons */}
            <button
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl
                bg-surface-light border border-border hover:border-primary/50 text-sm text-text
                transition-colors disabled:opacity-50 cursor-pointer"
            >
              {/* Google icon */}
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z" />
                <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-4.9l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7H6.3C9.8 39.6 16.4 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.4l6.2 5.2C41 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth("github")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl
                bg-surface-light border border-border hover:border-primary/50 text-sm text-text
                transition-colors disabled:opacity-50 cursor-pointer"
            >
              {/* GitHub mark */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Continue with GitHub
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Magic link */}
            <form onSubmit={handleMagicLink} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full text-sm bg-surface border border-border rounded-xl px-4 py-2.5
                  text-text placeholder:text-text-muted/50 outline-none focus:border-primary/50"
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                  bg-primary/20 border border-primary/30 hover:bg-primary/30 text-sm text-primary-light
                  transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                Send magic link
              </button>
            </form>

            {error && <p className="text-xs text-hard text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
