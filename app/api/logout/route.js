import { CORS } from '@/lib/store';

export async function POST() {
  return Response.json(
    { ok: true },
    {
      headers: {
        ...CORS,
        'Set-Cookie': 'session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
      },
    }
  );
}
