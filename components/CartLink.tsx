"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartLink() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="flex flex-col items-center gap-1 text-xs hover:text-pink-600 relative">
      <ShoppingBag className="w-5 h-5" />
      <span>Panier</span>
      <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
        {cartCount}
      </span>
    </Link>
  );
}
