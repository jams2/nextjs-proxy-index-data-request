# Proxy receives `/` for the data request of a page at `/index`

In a Pages Router app, client navigation to a page at `/index` fetches `/_next/data/<build>/index/index.json`. Next.js gives that request to Proxy with the path `/`, the same as the homepage's data request (`/_next/data/<build>/index.json`). A Proxy that treats `/` differently from other paths therefore handles the `/index` page as the homepage.

## The app

- `proxy.ts` rewrites `/` to `/landing` and passes every other request through. It sets the response header `x-proxy-pathname` to the path it received.
- `pages/landing.tsx` serves the homepage, through the rewrite. Its heading is `landing`.
- `pages/index/index.tsx` serves `/index`. Its heading is `/index`.
- `pages/about.tsx` serves `/about`. Its heading is `/about`.

All three pages use `getStaticProps`, so client navigation fetches their data from `/_next/data`. Each page links to `/`, `/index` and `/about`.

## Steps

```bash
npm install
npm run build
npm run start
```

In a browser:

1. Open http://localhost:3000/about. The heading is `/about`.
2. Click the `/index` link. The address bar shows `/index`, but the heading is `landing`.
3. Reload. The heading is `/index`.

With curl, while the server runs:

```bash
./scripts/check.sh
```

```
== /_next/data/<build>/index/index.json
HTTP/1.1 200 OK
x-proxy-pathname: /
x-nextjs-matched-path: /landing

== /_next/data/<build>/index.json
HTTP/1.1 200 OK
x-proxy-pathname: /
x-nextjs-matched-path: /landing
```

A full page load of http://localhost:3000/index reaches Proxy as `/index` and shows the `/index` page.

## Expected

Proxy receives `/index` for `index/index.json`, as it does for the full page load of `/index`. The request then passes through to `pages/index/index.tsx`, and client navigation to `/index` shows the `/index` page.

## Control: the router gets the path right

Move the rewrite from Proxy to `next.config.js`. Replace `proxy.ts` with a Proxy that passes every request through:

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    response.headers.set('x-proxy-pathname', request.nextUrl.pathname);
    return response;
}
```

and add `next.config.js`:

```js
module.exports = {
    async rewrites() {
        return { afterFiles: [{ source: '/', destination: '/landing' }] };
    },
};
```

Rebuild and restart. Client navigation to `/index` now shows `/index`, and `./scripts/check.sh` shows the router serving `index/index.json` from `/index`, while Proxy still receives `/`:

```
== /_next/data/<build>/index/index.json
HTTP/1.1 200 OK
x-proxy-pathname: /
x-nextjs-matched-path: /index

== /_next/data/<build>/index.json
HTTP/1.1 200 OK
x-proxy-pathname: /
x-nextjs-matched-path: /landing
```

## Versions

Reproduced with `next@16.3.8`, `next@16.4.6` and `next@16.5.0-canary.61`, on Node 24.21.0.
