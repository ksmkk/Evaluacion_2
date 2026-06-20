import { CORS } from '@/lib/store';

/**
 * FIX V3 (Open Redirect / A01):
 * El endpoint solo acepta rutas internas relativas que comiencen con un unico
 * slash. Se rechazan URLs absolutas, protocol-relative URLs (//host), backslash
 * y caracteres de control.
 */
function safeInternalRedirect(value) {
  if (typeof value !== 'string') return '/';
  if (!value.startsWith('/') || value.startsWith('//')) return '/';
  if (value.includes('\\') || /[\u0000-\u001F\u007F]/.test(value)) return '/';
  return value;
}

export async function GET(req) {
  const requestedUrl = new URL(req.url).searchParams.get('url') || '/';
  const location = safeInternalRedirect(requestedUrl);

  return new Response(null, {
    status: 302,
    headers: { Location: location, ...CORS },
  });
}
