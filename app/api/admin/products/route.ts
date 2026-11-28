import { createClient } from "@supabase/supabase-js";

type ProductInput = {
  brand: string;
  name: string;
  price: number;
  old_price: number | null;
  rating: number;
  image_url: string;
  description: string;
};

type AuthorizationResult =
  | {
      authorized: true;
      email: string;
      supabaseUrl: string;
      serviceRoleKey: string;
    }
  | { authorized: false; response: Response };

function errorResponse(message: string, status: number) {
  return Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function authorizeAdmin(request: Request): Promise<AuthorizationResult> {
  const authorization = request.headers.get("authorization");
  const tokenMatch = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!tokenMatch) {
    return {
      authorized: false,
      response: errorResponse("يلزم تسجيل الدخول.", 401),
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !adminEmail) {
    console.error("Admin API is missing required server environment variables.");
    return {
      authorized: false,
      response: errorResponse("إعدادات لوحة الإدارة غير مكتملة.", 503),
    };
  }

  const authClient = createClient(supabaseUrl!, anonKey!, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const { data, error } = await authClient.auth.getUser(tokenMatch[1]);

  if (error) {
    if (error.status !== 401) {
      console.error("Admin API could not verify the user's session:", error.message);
    }
    return {
      authorized: false,
      response: errorResponse("جلسة الدخول غير صالحة.", error.status === 401 ? 401 : 503),
    };
  }
  if (!data.user) {
    return {
      authorized: false,
      response: errorResponse("جلسة الدخول غير صالحة.", 401),
    };
  }

  const email = data.user.email?.trim();
  if (!email || email.toLowerCase() !== adminEmail) {
    return {
      authorized: false,
      response: errorResponse("ليس لديك صلاحية الوصول إلى لوحة الإدارة.", 403),
    };
  }

  return {
    authorized: true,
    email,
    supabaseUrl,
    serviceRoleKey,
  };
}

function parseProduct(input: unknown): ProductInput | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }

  const product = input as Record<string, unknown>;
  const { brand, name, price, old_price, rating, image_url, description } = product;

  if (
    typeof brand !== "string" ||
    brand.trim().length === 0 ||
    brand.length > 200 ||
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.length > 200 ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price <= 0 ||
    (old_price !== null &&
      (typeof old_price !== "number" ||
        !Number.isFinite(old_price) ||
        old_price <= 0)) ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    typeof image_url !== "string" ||
    image_url.length > 2048 ||
    typeof description !== "string" ||
    description.length > 10000
  ) {
    return null;
  }

  let imageUrl: URL;
  try {
    imageUrl = new URL(image_url);
  } catch {
    return null;
  }

  if (imageUrl.protocol !== "http:" && imageUrl.protocol !== "https:") {
    return null;
  }

  return {
    brand: brand.trim(),
    name: name.trim(),
    price,
    old_price,
    rating,
    image_url: imageUrl.toString(),
    description,
  };
}

export async function GET(request: Request) {
  const authorization = await authorizeAdmin(request);
  if (!authorization.authorized) return authorization.response;

  return Response.json(
    { email: authorization.email },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const authorization = await authorizeAdmin(request);
  if (!authorization.authorized) return authorization.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("بيانات الطلب غير صالحة.", 400);
  }

  const product = parseProduct(body);
  if (!product) {
    return errorResponse("تحقق من بيانات المنتج وأعد المحاولة.", 400);
  }

  const adminClient = createClient(
    authorization.supabaseUrl,
    authorization.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );
  const { error } = await adminClient.from("products").insert([product]);

  if (error) {
    console.error("Admin API could not insert a product:", error.message);
    return errorResponse("تعذر إضافة المنتج. تحقق من قاعدة البيانات.", 500);
  }

  return Response.json(
    { message: "تم إضافة المنتج بنجاح." },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
