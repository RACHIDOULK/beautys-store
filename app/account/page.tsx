"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Package, Clock } from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

type Order = {
  id: string;
  created_at: string;
  status: "pending" | "shipped" | "completed";
  total_amount: number;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
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

      setUser(user);

      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && ordersData) {
        setOrders(ordersData as Order[]);
      }
      setLoading(false);
    };

    fetchUserAndOrders();
  }, [router]);

  if (loading) return <div className="text-center py-20">جاري التحميل...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Compte</h1>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>
        <Link href="/" className="text-sm font-bold text-pink-600 hover:underline">
          ← Retour à la boutique
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-pink-600" />
          Historique de mes commandes
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore passé de commande.</p>
            <Link href="/" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition">
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-pink-50 p-3 rounded-full text-pink-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Commande #{order.id.split("-")[0].toUpperCase()}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-2 text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    {order.status === "pending" ? "En attente" : "Expédiée"}
                  </div>
                  <p className="font-bold text-gray-900">{order.total_amount.toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
