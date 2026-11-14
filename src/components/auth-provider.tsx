import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
const AuthContext = createContext<{ user: User | null; ready: boolean }>({ user: null, ready: false });
export const useStudentAuth = () => useContext(AuthContext);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false);
  const router = useRouter(); const queryClient = useQueryClient();
  useEffect(() => {
    let alive = true;
    void supabase.auth.getUser().then(({ data }) => { if (alive) { setUser(data.user); setReady(true); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      setUser(session?.user ?? null); setReady(true);
      void router.invalidate();
      if (event !== 'SIGNED_OUT') void queryClient.invalidateQueries();
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [router, queryClient]);
  return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>;
}