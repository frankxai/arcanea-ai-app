/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  User,
  Session,
  AuthError,
  type AuthChangeEvent,
} from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  createCredentialScope,
  providerActor,
} from "@/lib/ai/provider-preferences";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  credentialScope: ReturnType<typeof createCredentialScope>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabaseRef = useRef(createClient());
  const [credentialScope] = useState(createCredentialScope);
  const authRevisionRef = useRef(0);

  useEffect(() => {
    const supabase = supabaseRef.current;
    let mounted = true;
    const initialRevision = authRevisionRef.current;

    const initAuth = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted || authRevisionRef.current !== initialRevision) return;
        credentialScope.set(providerActor(initialSession?.user.id, false));
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (mounted && authRevisionRef.current === initialRevision) {
          credentialScope.set(providerActor(undefined, false));
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted && authRevisionRef.current === initialRevision)
          setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, currentSession: Session | null) => {
        if (!mounted) return;
        authRevisionRef.current += 1;
        credentialScope.set(providerActor(currentSession?.user.id, false));
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [credentialScope]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabaseRef.current.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const { error } = await supabaseRef.current.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split("@")[0],
          },
        },
      });
      return { error };
    },
    [],
  );

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabaseRef.current.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    const previousActor = credentialScope.get().actor;
    const pendingRevision = ++authRevisionRef.current;
    credentialScope.set(null);
    setIsLoading(true);
    try {
      const { error } = await supabaseRef.current.auth.signOut();
      if (error) throw error;
      if (authRevisionRef.current === pendingRevision) {
        credentialScope.set("guest");
        setUser(null);
        setSession(null);
        setIsLoading(false);
      }
    } catch (error) {
      if (authRevisionRef.current === pendingRevision) {
        credentialScope.set(previousActor);
        setIsLoading(false);
      }
      throw error;
    }
  }, [credentialScope]);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      credentialScope,
    }),
    [
      user,
      session,
      isLoading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      credentialScope,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
