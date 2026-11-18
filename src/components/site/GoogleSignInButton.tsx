import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { GOOGLE_CLIENT_ID, signInWithGoogle, signInWithGoogleIdToken } from "@/lib/auth";

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    nonce?: string;
    ux_mode?: "popup" | "redirect";
    context?: "signin" | "signup" | "use";
    auto_select?: boolean;
    itp_support?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      logo_alignment?: "left" | "center";
      width?: number;
    },
  ) => void;
}

type GoogleWindow = Window & {
  google?: {
    accounts?: {
      id?: GoogleAccountsId;
    };
  };
};

let gisScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("SSR"));
  }
  if ((window as GoogleWindow).google?.accounts?.id) {
    return Promise.resolve();
  }
  if (gisScriptPromise) return gisScriptPromise;

  gisScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Sign-In")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gisScriptPromise = null;
      reject(new Error("Failed to load Google Sign-In"));
    };
    document.head.appendChild(script);
  });

  return gisScriptPromise;
}

function createRawNonce(): string {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
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
  const buttonHostRef = useRef<HTMLDivElement | null>(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const [gisReady, setGisReady] = useState(false);
  const [gisFailed, setGisFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setupGis() {
      if (typeof window === "undefined" || !window.crypto?.subtle || !GOOGLE_CLIENT_ID) {
        if (!cancelled) setGisFailed(true);
        return;
      }

      try {
        await loadGoogleIdentityScript();
        if (cancelled) return;

        const googleId = (window as GoogleWindow).google?.accounts?.id;
        const container = buttonHostRef.current;
        if (!googleId || !container) {
          setGisFailed(true);
          return;
        }

        const rawNonce = createRawNonce();
        const hashedNonce = await sha256Hex(rawNonce);
        if (cancelled) return;

        googleId.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce: hashedNonce,
          ux_mode: "popup",
          context: "signin",
          auto_select: false,
          itp_support: true,
          callback: async (response: GoogleCredentialResponse) => {
            if (!response.credential) {
              const msg = "Google did not return a sign-in token. Please try again.";
              setErr(msg);
              onErrorRef.current?.(msg);
              return;
            }
            setBusy(true);
            setErr(null);
            try {
              const { error } = await signInWithGoogleIdToken(response.credential, rawNonce);
              if (error) {
                const msg = error.message || "Google sign-in failed. Please try again.";
                setErr(msg);
                onErrorRef.current?.(msg);
              }
            } catch (e) {
              const msg = e instanceof Error ? e.message : "Failed to complete Google sign-in";
              setErr(msg);
              onErrorRef.current?.(msg);
            } finally {
              setBusy(false);
            }
          },
        });

        container.innerHTML = "";
        const availableWidth = Math.floor(container.getBoundingClientRect().width || 360);
        const buttonWidth = Math.max(240, Math.min(400, availableWidth));

        googleId.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
          width: buttonWidth,
        });

        setGisReady(true);
      } catch {
        if (!cancelled) setGisFailed(true);
      }
    }

    setupGis();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFallbackOAuth = async () => {
    setBusy(true);
    setErr(null);
    try {
      const { error } = await signInWithGoogle(redirectTo);
      if (error) {
        let msg = error.message;
        if (msg.toLowerCase().includes("provider is not enabled") || msg.toLowerCase().includes("unsupported provider")) {
          msg = "Google Sign-In is not enabled yet in your Supabase project. Enable Google under Authentication > Providers in Supabase.";
        }
        setErr(msg);
        onErrorRef.current?.(msg);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to initiate Google sign in";
      setErr(msg);
      onErrorRef.current?.(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full space-y-2.5">
      {busy && (
        <div className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-white px-5 text-sm font-semibold text-[#111418] shadow-sm sm:text-base">
          <Loader2 className="h-4 w-4 animate-spin text-[#4285F4]" />
          <span>Signing in with Google…</span>
        </div>
      )}

      {!gisFailed ? (
        <div className={busy ? "hidden" : "space-y-2.5"}>
          <div className="flex min-h-[48px] w-full items-center justify-center overflow-hidden rounded-xl bg-white px-2 py-1 shadow-sm">
            <div ref={buttonHostRef} className="flex w-full items-center justify-center" />
            {!gisReady && (
              <div className="flex items-center gap-2 py-1.5 text-sm font-medium text-[#111418]">
                <Loader2 className="h-4 w-4 animate-spin text-[#4285F4]" />
                <span>Loading Google Sign-In…</span>
              </div>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Popup blocked?{" "}
            <button
              type="button"
              onClick={handleFallbackOAuth}
              className="cursor-pointer font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              Sign in with redirect instead
            </button>
          </p>
        </div>
      ) : (
        !busy && (
          <button
            type="button"
            onClick={handleFallbackOAuth}
            disabled={busy}
            className={`flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-5 text-sm font-semibold text-[#111418] shadow-sm transition-all hover:bg-neutral-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base ${className}`}
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            <span>{children ?? "Continue with Google"}</span>
          </button>
        )
      )}

      {err && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {err}
        </p>
      )}
    </div>
  );
}
