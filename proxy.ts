import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Serve the homepage from `/landing`, and pass every other request through.
// The `x-proxy-pathname` response header shows the path that Proxy received.
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response =
        pathname === '/' ? NextResponse.rewrite(new URL('/landing', request.url)) : NextResponse.next();
    response.headers.set('x-proxy-pathname', pathname);
    return response;
}
