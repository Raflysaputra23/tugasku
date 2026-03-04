"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface Profile {
    id: string;
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<{ error: any }>;
    // updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const supabase = createClient();

    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // const fetchProfile = async (userId: string) => {
    //     const { data } = await supabase
    //         .from("profiles")
    //         .select("*")
    //         .eq("user_id", userId)
    //         .single();
    //     setProfile(data as Profile | null);
    // };


    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setProfile(null);
                setLoading(false);
            }
        );

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: window.location.origin,
            },
        });
        return { error };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };
    
    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `https://rafai-chat.vercel.app/dashboard`,
            },
        });
        return { error };
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    // const updateProfile = async (updates: Partial<Profile>) => {
    //     if (!user) return { error: "Not authenticated" };
    //     const { error } = await supabase
    //         .from("profiles")
    //         .update(updates)
    //         .eq("user_id", user.id);
    //     if (!error) await fetchProfile(user.id);
    //     return { error };
    // };

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}