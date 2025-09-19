// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const withUserId = (request: NextRequest, response: NextResponse) => {
  if (!request.cookies.get('userId')) {
    response.cookies.set('userId', crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    });
  }
  return response;
};

const requireAdmin = async (request: NextRequest, response: NextResponse) => {  
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    const token = request.cookies.get('admin_session')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      return response;
    } catch {
      const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url));
      redirectResponse.cookies.delete('admin_session');
      return redirectResponse;
    }
  }
  
  return response;
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();
  
  // Apply userId middleware first
  response = withUserId(request, response);
  
  // Then apply admin auth middleware
  response = await requireAdmin(request, response);
  
  // If there's a redirect, return it immediately
  if (response.headers.get('location')) {
    return response;
  }
  
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};