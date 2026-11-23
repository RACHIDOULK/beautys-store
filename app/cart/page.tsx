"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("يجب عليك تسجيل الدخول أولاً لإتمام الطلب.");
      router.push("/login");
      setIsCheckingOut(false);
      return;
    }

    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          total_amount: cartTotal,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("خطأ في حفظ الطلب:", error);
      alert("حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.");
      setIsCheckingOut(false);
      return;
    }

    clearCart();
    router.push(`/order-success/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Découvrez nos produits et faites-vous plaisir !</p>
        <Link href="/" className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-700 transition">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 py-4">
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-50" />

              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase">{item.brand}</p>
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-pink-600 font-bold mt-1">{item.price} €</p>
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-50">-</button>
                <span className="px-3 py-1 border-x border-gray-200">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-50">+</button>
              </div>

              <p className="font-bold text-gray-900 w-20 text-right">{item.price * item.quantity} €</p>

              <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition ml-4">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h2>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Sous-total</span>
              <span>{cartTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Livraison</span>
              <span className="text-green-600 font-medium">Gratuite</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900 mb-6">
              <span>Total</span>
              <span>{cartTotal.toFixed(2)} €</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCheckingOut ? "Traitement en cours..." : "Passer la commande"}
              {!isCheckingOut && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
