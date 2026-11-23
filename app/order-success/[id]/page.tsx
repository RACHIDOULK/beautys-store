import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const instant = false;

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Merci pour votre commande !</h1>
      <p className="text-gray-600 mb-2">Votre commande a été enregistrée avec succès.</p>
      <p className="text-sm text-gray-400 mb-8">
        Numéro de commande : #{resolvedParams.id.split("-")[0].toUpperCase()}
      </p>

      <Link href="/" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition">
        Retour à la boutique
      </Link>
    </div>
  );
}
