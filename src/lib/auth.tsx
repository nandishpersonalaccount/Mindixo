import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setState({ user: data.session?.user ?? null, loading: false });
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (["INITIAL_SESSION", "SIGNED_IN", "SIGNED_OUT", "USER_UPDATED", "TOKEN_REFRESHED"].includes(event)) {
        setState({ user: session?.user ?? null, loading: false });
      }
      if (["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) {
        router.invalidate();
        if (event !== "SIGNED_OUT") qc.invalidateQueries();
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router, qc]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext).user;
export const useAuthState = () => useContext(AuthContext);

export async function signInWithGoogle(redirectTo?: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const target = redirectTo
    ? redirectTo.startsWith("http")
      ? redirectTo
      : `${origin}${redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`}`
    : `${origin}/checkout`;

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: target,
      queryParams: {
        prompt: "select_account",
      },
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
