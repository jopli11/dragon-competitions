import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Block common PHP vulnerability scanners and known bad bots
const BLOCKED_EXTENSIONS = ['.php', '.asp', '.aspx', '.jsp', '.env', '.git'];
const BLOCKED_USER_AGENTS = [
  'python-requests',
  'curl',
  'wget',
  'libwww-perl',
  'go-http-client',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // 1. Block requests for sensitive file extensions (PHP scans, etc.)
  if (BLOCKED_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext))) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    console.warn(`Blocked request for sensitive extension: ${pathname} from ${ip}`);
    return new NextResponse(null, { status: 404 });
  }

  // 2. Block suspicious user agents
  if (BLOCKED_USER_AGENTS.some(ua => userAgent.includes(ua))) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    console.warn(`Blocked suspicious user agent: ${userAgent} from ${ip}`);
    return new NextResponse(null, { status: 403 });
  }

  // 3. Optional: Block specific paths often targeted by bots
  if (pathname.includes('/wp-admin') || pathname.includes('/wp-login') || pathname.includes('/xmlrpc')) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (logo)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};
