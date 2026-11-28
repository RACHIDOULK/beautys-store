"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, Settings, LogOut, ChevronRight } from "lucide-react";

type Order = {
  id: string;
  created_at: string;
  total_amount: number;
};

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) setOrders(ordersData as Order[]);
      setLoading(false);
    };
    fetchUserAndOrders();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">

        {/* القائمة الجانبية */}
        <aside className="w-full md:w-1/4">
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <p className="text-sm text-gray-500 mb-1">Bonjour,</p>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rachid</h2>
            <button onClick={handleLogout} className="w-full border border-gray-300 text-sm font-bold py-2 rounded hover:bg-gray-100 transition">
              Déconnexion
            </button>
          </div>

          <nav className="space-y-1">
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 font-medium rounded">
              <User className="w-5 h-5" /> Mon Compte
            </Link>
            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded">
              <Package className="w-5 h-5" /> Mes achats
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded">
              <Heart className="w-5 h-5" /> Mes favoris
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded">
              <Settings className="w-5 h-5" /> Paramètres du compte
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded w-full text-left">
              <LogOut className="w-5 h-5" /> Se déconnecter
            </button>
          </nav>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon compte</h1>

          {/* كرت سجل الطلبات */}
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Package className="w-5 h-5" /> Mes commandes
              </h2>
              <Link href="/account/orders" className="text-sm text-gray-500 hover:underline flex items-center gap-1">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">Vous n&apos;avez pas encore passé de commande.</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <p className="font-medium text-sm">Commande #{order.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.total_amount.toFixed(2)} €</p>
                      <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">En attente</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* كروت إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold mb-2">Mes favoris</h3>
              <p className="text-sm text-gray-500 mb-4">Retrouvez vos produits préférés.</p>
              <button className="w-full border border-black py-2 text-sm font-bold hover:bg-black hover:text-white transition">Voir mes favoris</button>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold mb-2">Programme de fidélité</h3>
              <p className="text-sm text-gray-500 mb-4">Découvrez vos avantages.</p>
              <button className="w-full border border-black py-2 text-sm font-bold hover:bg-black hover:text-white transition">En savoir plus</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}