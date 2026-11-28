"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  const router = useRouter();

  // التحقق من وجود جلسة صالحة عند تحميل الصفحة (يتم إنشاؤها تلقائياً عند النقر على رابط البريد)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        setMessage("رابط إعادة التعيين غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.");
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (password.length < 6) {
      setMessage("يجب أن تكون كلمة المرور 6 أحرف على الأقل.");
      return;
    }

    setLoading(true);
    setMessage("");

    // تحديث كلمة مرور المستخدم
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(`خطأ: ${error.message}`);
    } else {
      setMessage("تم تغيير كلمة المرور بنجاح! سيتم تحويلك إلى صفحة تسجيل الدخول...");
      setTimeout(() => router.push("/login"), 2000);
    }
    setLoading(false);
  };

  if (!isValidSession && !message) {
    return <div className="text-center py-20">جاري التحقق من الرابط...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تعيين كلمة مرور جديدة</h1>
          <p className="text-gray-500 text-sm">أدخل كلمة المرور الجديدة الخاصة بك.</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-6 ${message.includes("خطأ") || message.includes("غير صالح") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {message}
          </div>
        )}

        {isValidSession && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}