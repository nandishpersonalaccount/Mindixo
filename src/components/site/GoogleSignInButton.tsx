import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth";

export function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
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
  );
}

interface GoogleSignInButtonProps {
  redirectTo?: string;
  className?: string;
  children?: React.ReactNode;
  onError?: (msg: string) => void;
}

export function GoogleSignInButton({
  redirectTo = "/checkout",
  className = "",
  children,
  onError,
}: GoogleSignInButtonProps) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleClick = async () => {
    setBusy(true);
    setErr(null);
    try {
      const { error } = await signInWithGoogle(redirectTo);
      if (error) {
        let msg = error.message;
        if (msg.toLowerCase().includes("provider is not enabled") || msg.toLowerCase().includes("unsupported provider")) {
          msg = "Google Sign-In is not enabled yet in your Supabase project. Please enable Google under Authentication > Providers in your Supabase dashboard.";
        }
        setErr(msg);
        if (onError) onError(msg);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to initiate Google sign in";
      setErr(msg);
      if (onError) onError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={busy}
        className={`w-full h-12 flex items-center justify-center gap-3 font-medium transition-colors hover:bg-neutral-800 ${className}`}
      >
        <GoogleIcon className="h-5 w-5" />
        {busy ? "Connecting to Google…" : (children ?? "Continue with Google")}
      </Button>
      {err && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {err}
        </p>
      )}
    </div>
  );
}
