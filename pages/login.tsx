import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, KeyRound, AlertTriangle, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/data/portfolio";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to admin
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: Record<string, string> = { username, password };
      if (mfaRequired) {
        payload.otp = otp;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      if (data.mfaRequired) {
        setMfaRequired(true);
        setError(null);
      } else if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token_type", data.token_type || "Bearer");
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login — {siteConfig.name}</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </Head>

      <div className="min-h-screen bg-ink flex flex-col justify-center items-center px-6 relative dot-pattern">
        {/* Glow backdrop */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-signal/5 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full relative z-10 space-y-6"
        >
          {/* Logo / Header */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-display font-bold text-2xl tracking-tight group mb-2"
            >
              <span className="text-text-primary group-hover:text-signal transition-colors duration-200">
                param
              </span>
              <span className="text-signal">.</span>
            </Link>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Protected Admin Portal
            </p>
          </div>

          {/* Form Card */}
          <div className="card p-8 bg-surface border border-rim">
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!mfaRequired ? (
                  <motion.div
                    key="step-credentials"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Username */}
                    <div>
                      <label className="field-label" htmlFor="username">
                        Username
                      </label>
                      <div className="relative">
                        <User
                          size={14}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <input
                          id="username"
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="admin"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="field-label" htmlFor="password">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          size={14}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-mfa"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* MFA OTP */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="field-label !mb-0" htmlFor="otp">
                          MFA Verification Code
                        </label>
                        <button
                          type="button"
                          onClick={() => setMfaRequired(false)}
                          className="text-[10px] font-mono text-signal hover:underline"
                        >
                          Back to credentials
                        </button>
                      </div>
                      <div className="relative">
                        <KeyRound
                          size={14}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <input
                          id="otp"
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="input-field pl-10 tracking-widest font-mono text-center text-lg"
                        />
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed mt-2">
                        Enter the 6-digit verification code from your Google Authenticator or Microsoft Authenticator app.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error messages */}
              {error && (
                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl p-3">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center text-xs py-3 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                ) : mfaRequired ? (
                  "Verify & Log In"
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          </div>

          {/* Cancel/Back link */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={12} /> Back to homepage
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
