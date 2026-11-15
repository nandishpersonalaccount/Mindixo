import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/auth")({
  head: () => pageMeta("Admin sign in", "Secure access to Mindixo store management."),
  component: Auth,
});

function Auth() {
  const user = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/lordshivstoremanagenment" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setMessage("Check your email for a password reset link.");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        setMessage("Check your email to confirm your account. Admin access is granted separately.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/lordshivstoremanagenment" });
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google") {
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + "/auth",
      },
    });
    if (error) setMessage(error.message);
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <p className="eyebrow">Mindixo / Administration</p>
      <h1 className="mt-4 text-3xl font-semibold">
        {mode === "reset" ? "Reset password" : mode === "signup" ? "Create an account" : "Welcome back."}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Store management is restricted to approved admins.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="admin-label">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            className="admin-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {mode !== "reset" && (
          <label className="admin-label">
            Password
            <input
              type="password"
              minLength={8}
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="admin-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
        <Button className="w-full h-11" disabled={busy}>
          {busy ? "Please wait…" : mode === "reset" ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>
      {message && (
        <p role="status" className="mt-5 text-sm">
          {message}
        </p>
      )}
      {mode !== "reset" && (
        <div className="mt-6 space-y-3">
          <Button variant="outline" className="h-11 w-full" onClick={() => social("google")}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      )}
      <div className="mt-5 flex flex-wrap justify-between gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setMessage("");
          }}
        >
          {mode === "signup" ? "Back to sign in" : "Create account"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setMode(mode === "reset" ? "login" : "reset");
            setMessage("");
          }}
        >
          {mode === "reset" ? "Back to sign in" : "Forgot password?"}
        </Button>
      </div>
    </section>
  );
}
