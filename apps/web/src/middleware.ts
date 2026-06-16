import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DIAGNOSTIC_HEADER_ALLOWLIST = [
  'accept',
  'accept-language',
  'cf-connecting-ip',
  'cf-ipcountry',
  'cf-ray',
  'host',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-fetch-dest',
  'sec-fetch-mode',
  'sec-fetch-site',
  'user-agent',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
];

// Block common PHP vulnerability scanners and known bad bots
const BLOCKED_EXTENSIONS = ['.php', '.asp', '.aspx', '.jsp', '.env', '.git'];
const BLOCKED_USER_AGENTS = [
  'python-requests',
  'curl',
  'wget',
  'libwww-perl',
  'go-http-client',
];

function getRequestDiagnostics(request: NextRequest, requestId: string) {
  const headers = Object.fromEntries(
    DIAGNOSTIC_HEADER_ALLOWLIST.map((header) => [
      header,
      request.headers.get(header) || undefined,
    ]).filter(([, value]) => Boolean(value))
  );

  return {
    event: 'request_diagnostics',
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    hasSearch: request.nextUrl.search.length > 0,
    headers,
  };
}

function shouldLogNavigation(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const secFetchDest = request.headers.get('sec-fetch-dest');
  const accept = request.headers.get('accept') || '';

  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return false;
  }

  return secFetchDest === 'document' || accept.includes('text/html');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const requestId = crypto.randomUUID();

  // 1. Block requests for sensitive file extensions (PHP scans, etc.)
  if (BLOCKED_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext))) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    console.warn(JSON.stringify({
      event: 'blocked_sensitive_extension',
      requestId,
      path: pathname,
      ip,
      userAgent: request.headers.get('user-agent') || undefined,
    }));
    return new NextResponse(null, { status: 404 });
  }

  // 2. Block suspicious user agents
  if (BLOCKED_USER_AGENTS.some(ua => userAgent.includes(ua))) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    console.warn(JSON.stringify({
      event: 'blocked_suspicious_user_agent',
      requestId,
      path: pathname,
      ip,
      userAgent: request.headers.get('user-agent') || undefined,
    }));
    return new NextResponse(null, { status: 403 });
  }

  // 3. Optional: Block specific paths often targeted by bots
  if (pathname.includes('/wp-admin') || pathname.includes('/wp-login') || pathname.includes('/xmlrpc')) {
    return new NextResponse(null, { status: 404 });
  }

  // 4. Reject unexpected write-method requests to the GET-only homepage.
  //    The homepage has no <form> and no server action, so it never receives a
  //    legitimate POST. Scanners still POST multipart/form-data bodies to "/",
  //    which Next.js tries to decode as a server-action payload; a truncated
  //    body makes its internal parser throw "Unexpected end of form" and return
  //    an unhandled 500 before any page code runs. Stopping it here returns a
  //    correct 405 and avoids the noisy 500.
  //
  //    JS-dispatched server actions carry a `Next-Action` header, so they are
  //    allowed through — if a no-JS server-action form is ever added to "/",
  //    revisit this guard (the no-JS fallback posts multipart without that header).
  if (
    pathname === '/' &&
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    !request.headers.has('next-action')
  ) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    console.warn(JSON.stringify({
      event: 'blocked_unexpected_write_method',
      requestId,
      method: request.method,
      path: pathname,
      ip,
      userAgent: request.headers.get('user-agent') || undefined,
    }));
    return new NextResponse(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }

  if (shouldLogNavigation(request)) {
    console.info(JSON.stringify(getRequestDiagnostics(request, requestId)));
  }

  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);
  return response;
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
