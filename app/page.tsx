import Link from "next/link";
import { Search, Heart } from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import CartLink from "@/components/CartLink";
import UserNav from "@/components/UserNav";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

export const instant = false;

async function ProductList({ search }: { search: string }) {
  let query = supabase.from("products").select("*");

  if (search) {
    query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("خطأ في جلب المنتجات:", error);
    return <p className="col-span-5 text-center py-10 text-red-500">حدث خطأ أثناء الاتصال بقاعدة البيانات</p>;
  }

  if (!products || products.length === 0) {
    return <p className="col-span-5 text-center py-10 text-gray-500">لا توجد منتجات تطابق بحثك &quot;{search}&quot;.</p>;
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          brand={product.brand}
          name={product.name}
          price={product.price}
          oldPrice={product.old_price}
          rating={product.rating}
          image={product.image_url}
        />
      ))}
    </>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || "";

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-pink-50 text-center py-2 text-xs font-medium text-pink-600">
        Livraison offerte dès 49€ d&apos;achat ✨ (توصيل مجاني)
      </div>

      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="text-2xl font-bold tracking-widest text-pink-600">
            BEAUTÉ<span className="text-gray-800">.</span>
          </div>

          <form action="/" className="flex-1 max-w-xl relative hidden md:block">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Rechercher un produit, une marque..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-pink-300"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </form>

          <div className="flex items-center gap-6 text-gray-600">
            <UserNav />
            <Link href="#" className="flex flex-col items-center gap-1 text-xs hover:text-pink-600">
              <Heart className="w-5 h-5" />
              <span>Favoris</span>
            </Link>
            <CartLink />
          </div>
        </div>

        <nav className="container mx-auto px-4 py-3 border-t border-gray-100">
          <ul className="flex items-center justify-center gap-8 text-sm font-medium text-gray-700">
            <li className="hover:text-pink-600 cursor-pointer text-pink-600 border-b-2 border-pink-600 pb-1">Nouveautés</li>
            <li className="hover:text-pink-600 cursor-pointer">Parfums</li>
            <li className="hover:text-pink-600 cursor-pointer">Maquillage</li>
            <li className="hover:text-pink-600 cursor-pointer">Soin</li>
            <li className="hover:text-pink-600 cursor-pointer">Cheveux</li>
            <li className="hover:text-pink-600 cursor-pointer">Marques</li>
            <li className="hover:text-pink-600 cursor-pointer text-red-500 font-bold">Black Friday</li>
          </ul>
        </nav>
      </header>

      <main className="pb-20">
        <HeroBanner />

        <section className="container mx-auto px-4 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Résultats pour "${searchQuery}"` : "Les nouveautés marques"}
            </h2>
            {!searchQuery && <button className="text-sm font-bold text-pink-600 hover:underline">Voir tout</button>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Suspense fallback={<p className="col-span-5 text-center py-10">جاري تحميل المنتجات...</p>}>
              <ProductList search={searchQuery} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
