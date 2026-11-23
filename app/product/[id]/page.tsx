import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import { Star, ShieldCheck, Truck } from "lucide-react";

export const instant = false;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2">
          <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-8">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <p className="text-sm font-bold text-pink-600 tracking-wider uppercase mb-2">
            {product.brand}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.rating}.0) - 124 Avis</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{product.price} €</span>
            {product.old_price && (
              <span className="text-xl text-gray-400 line-through mb-1">{product.old_price} €</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description || "Aucune description disponible pour ce produit."}
          </p>

          <AddToCartButton product={product} />

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-pink-600" />
              <span>Livraison gratuite</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-pink-600" />
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
