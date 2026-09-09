interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);
    const newHeaders = new Headers(response.headers);

    // Security & SEO baseline headers
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'DENY');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Smart caching based on path
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname.startsWith('/assets/')) {
      // Vite hashed asset bundles
      newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname === '/site.webmanifest' ||
      pathname === '/favicon.svg' ||
      pathname === '/og-image.svg'
    ) {
      // Static SEO & PWA assets
      newHeaders.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
