import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // 1. Protect authenticated routes
  const protectedRoutes = ["/dashboard", "/jobs/post"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Protect job application route (only for job-seekers)
  if (pathname.match(/^\/jobs\/[^/]+\/apply$/)) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = user.user_metadata?.role;
    if (userRole !== "job-seeker") {
      const jobId = pathname.split("/")[2];
      return NextResponse.redirect(new URL(`/jobs/${jobId}`, request.url));
    }
  }

  // 3. Redirect logged-in users away from auth pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. RBAC: Only employers can post jobs
  if (pathname.startsWith("/jobs/post") && user) {
    const userRole = user.user_metadata?.role;

    if (userRole !== "employer") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}