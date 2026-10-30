import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Renova a sessão e bloqueia /admin sem sessão. A checagem de aal2 e allowlist ocorre em cada página e ação. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  if (!url || !key) {
    if (isAdminPath && request.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  if (isAdminPath) {
    const { data } = await supabase.auth.getUser();
    if (!data.user && request.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return response;
}
