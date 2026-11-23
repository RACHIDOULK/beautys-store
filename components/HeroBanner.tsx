export default function HeroBanner() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-gradient-to-r from-pink-100 to-rose-200 flex items-center">
        {/* نصوص البانر */}
        <div className="z-10 px-12 md:w-1/2">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Black Friday
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Jusqu&apos;à <span className="text-pink-600">-30%</span> sur toute la beauté
          </h2>
          <p className="text-gray-700 mb-8 text-lg">Profitez de nos offres exclusives avant qu&apos;il ne soit trop tard.</p>
          <button className="bg-white text-gray-900 border-2 border-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-colors duration-300">
            Découvrir
          </button>
        </div>
        
        {/* صورة توضيحية (استخدمنا صورة من الإنترنت مؤقتاً) */}
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop" 
            alt="Cosmetics" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}