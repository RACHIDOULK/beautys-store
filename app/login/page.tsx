"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push("/account"); // بعد الدخول يذهب لصفحة الحساب
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-12 px-4">
      
      <div className="mb-8">
        <img src="/logo.png.jpg" alt="Beautys Morocco" className="h-16 w-auto object-contain mx-auto" />
      </div>

      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isLogin ? "Se connecter ou s'inscrire" : "Créer un compte"}
        </h2>

        {message && (
          <div className={`p-3 rounded text-sm mb-6 text-center ${message.includes("بنجاح") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Adresse e-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="w-4 h-4 accent-black" />
            <span>Rester connecté</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-sm text-gray-600 underline hover:text-black">
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
          <p>L'ouverture d'un compte est réservée aux personnes âgées de 16 ans et plus.</p>
          <button 
            onClick={() => { setIsLogin(!isLogin); setMessage(""); }}
            className="mt-4 text-black font-bold hover:underline"
          >
            {isLogin ? "Créer un compte" : "J'ai déjà un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}