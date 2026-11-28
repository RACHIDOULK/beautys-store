"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type AdminApiResponse = {
  email?: string;
  error?: string;
  message?: string;
};

const initialFormData = {
  brand: "",
  name: "",
  price: "",
  old_price: "",
  rating: "5",
  image_url: "",
  description: "",
};

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace("/login");
          return;
        }

        const response = await fetch("/api/admin/products", {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: "no-store",
        });
        const result = await response.json() as AdminApiResponse;

        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (response.status === 403) {
          router.replace("/");
          return;
        }
        if (!response.ok) {
          if (active) setMessage(result.error ?? "تعذر التحقق من صلاحيات المدير.");
          return;
        }
        if (!result.email) {
          if (active) setMessage("استجابة غير صالحة من خادم الإدارة.");
          return;
        }

        if (active) {
          setAdminEmail(result.email);
          setIsAuthorized(true);
        }
      } catch {
        if (active) setMessage("تعذر الاتصال بخادم الإدارة.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void checkAdminAccess();
    return () => {
      active = false;
    };
  }, [router]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          old_price: formData.old_price ? Number(formData.old_price) : null,
          rating: Number(formData.rating),
        }),
      });
      const result = await response.json() as AdminApiResponse;

      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (response.status === 403) {
        router.replace("/");
        return;
      }
      if (!response.ok) {
        setMessage(result.error ?? "تعذر إضافة المنتج.");
        return;
      }

      setMessage(result.message ?? "تم إضافة المنتج بنجاح.");
      setFormData({ ...initialFormData });
    } catch {
      setMessage("تعذر الاتصال بخادم الإدارة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">جاري التحقق...</div>;
  if (!isAuthorized) {
    return <div className="text-center py-20 text-red-600">{message || "ليس لديك صلاحية الوصول."}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم المدير</h1>
      <p className="text-gray-600 mb-8">مرحباً بك، {adminEmail}</p>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-800">إضافة منتج جديد</h2>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-6 ${message.includes("بنجاح") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الماركة (Brand)</label>
              <input type="text" required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="DIOR" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (Name)</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Sauvage" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر (€)</label>
              <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="120.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر القديم (€)</label>
              <input type="number" step="0.01" value={formData.old_price} onChange={(e) => setFormData({...formData, old_price: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="150.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التقييم (1-5)</label>
              <input type="number" min="1" max="5" required value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة (URL)</label>
            <input type="url" required value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (Description)</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="وصف المنتج..."></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "جارٍ الإضافة..." : "إضافة المنتج"}
          </button>
        </form>
      </div>
    </div>
  );
}