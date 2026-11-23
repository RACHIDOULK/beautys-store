"use client";

import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  id: number;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  rating: number;
};

export default function ProductCard({ id, brand, name, price, oldPrice, image, rating }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 relative bg-white flex flex-col h-full">
      
      {/* زر المفضلة */}
      <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:text-pink-600 z-10">
        <Heart className="w-5 h-5" />
      </button>

      {/* صورة المنتج */}
      <Link href={`/product/${id}`}>
        <div className="w-full h-48 bg-gray-50 rounded-lg mb-4 overflow-hidden flex items-center justify-center cursor-pointer">
          <img src={image} alt={name} className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>

      {/* تفاصيل المنتج */}
      <div className="flex-1 flex flex-col">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{brand}</p>
        <Link href={`/product/${id}`}>
          <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 hover:text-pink-600 transition">{name}</h3>
        </Link>
        
        {/* التقييم */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating}.0)</span>
        </div>

        {/* السعر */}
        <div className="mt-auto flex items-end gap-2">
          <span className="text-lg font-bold text-gray-900">{price} €</span>
          {oldPrice && <span className="text-sm text-gray-400 line-through mb-0.5">{oldPrice} €</span>}
        </div>

        {/* زر الإضافة للسلة */}
        <button
          onClick={() => addToCart({ id, brand, name, price, image_url: image })}
          className="mt-4 w-full bg-pink-50 text-pink-600 font-bold py-2 rounded-lg hover:bg-pink-600 hover:text-white transition-colors duration-200"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}