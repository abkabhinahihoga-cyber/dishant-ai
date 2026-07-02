import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Basic route protection:
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/career') ||
                           request.nextUrl.pathname.startsWith('/roadmap') ||
                           request.nextUrl.pathname.startsWith('/resume') ||
                           request.nextUrl.pathname.startsWith('/portfolio') ||
                           request.nextUrl.pathname.startsWith('/interviews') ||
                           request.nextUrl.pathname.startsWith('/jobs') ||
                           request.nextUrl.pathname.startsWith('/study-planner') ||
                           request.nextUrl.pathname.startsWith('/wellness') ||
                           request.nextUrl.pathname.startsWith('/settings') ||
                           request.nextUrl.pathname.startsWith('/admin');

  const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding');
                           
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup') ||
                      request.nextUrl.pathname === '/';

  // Redirect unauthenticated users trying to access protected routes
  if ((isProtectedRoute || isOnboardingRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // For authenticated users: check onboarding status
  if (user && (isAuthRoute || isProtectedRoute)) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('auth_user_id', user.id)
        .single();

      const onboardingDone = profile?.onboarding_completed === true;

      // If user hasn't completed onboarding and isn't already on /onboarding, redirect them there
      if (!onboardingDone && !isOnboardingRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }

      // If user completed onboarding and is on an auth route, send to dashboard
      if (onboardingDone && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } catch {
      // If profile check fails, allow through (don't block the user)
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
