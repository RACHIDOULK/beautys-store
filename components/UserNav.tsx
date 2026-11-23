"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function UserNav() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/account" className="flex flex-col items-center gap-1 text-xs text-pink-600 font-medium">
          <User className="w-5 h-5" />
          <span>Mon Compte</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition">
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-pink-600 transition">
      <User className="w-5 h-5" />
      <span>Compte</span>
    </Link>
  );
}
