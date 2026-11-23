"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  image_url: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart({ ...product, image_url: product.image_url })}
      className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 text-lg"
    >
      <ShoppingBag className="w-6 h-6" />
      Ajouter au panier
    </button>
  );
}
