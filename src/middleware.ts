import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect admin routes - require ADMIN role
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        // Redirect non-admins to home page
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Admin routes require authentication
        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        // Other protected routes
        if (pathname.startsWith('/account') || pathname.startsWith('/orders')) {
          return !!token;
        }

        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/orders/:path*',
  ],
};
