import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
const AuthContext = createContext<User | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
 const [user,setUser] = useState<User | null>(null); const router = useRouter(); const qc = useQueryClient();
 useEffect(() => { supabase.auth.getUser().then(({data}) => setUser(data.user)); const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
 if (!["SIGNED_IN","SIGNED_OUT","USER_UPDATED"].includes(event)) return;
 setUser(session?.user ?? null); router.invalidate(); if(event !== "SIGNED_OUT") qc.invalidateQueries();
 }); return () => subscription.unsubscribe(); },[router,qc]);
 return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
