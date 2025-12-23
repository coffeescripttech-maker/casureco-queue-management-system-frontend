import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔒 Middleware: Checking path:', pathname);

  // Public routes that don't require authentication
  const publicRoutes = [
    '/display',
    '/kiosk',
    '/login',
    '/register',
    '/maintenance',
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  console.log('🔒 Middleware: Is public route?', isPublicRoute);

  // Allow public routes without any checks
  if (isPublicRoute) {
    console.log('🔒 Middleware: Allowing public route');
    return NextResponse.next();
  }

  // For protected routes, check authentication
  const token = request.cookies.get('auth_token')?.value;

  console.log('🔒 Middleware: Has token?', !!token);

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    console.log('🔒 Middleware: Redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log('🔒 Middleware: Allowing authenticated route');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};
