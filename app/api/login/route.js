import { users, verifyPassword, makeSession, CORS } from '@/lib/store';

function buildSessionCookie(session) {
  return [
    `session=${encodeURIComponent(session)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=3600',
  ].join('; ');
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const user = users.find((u) => u.username === username);
    if (!user || !verifyPassword(user, password)) {
      return Response.json({ error: 'Credenciales invalidas' }, { status: 401, headers: CORS });
    }

    const session = makeSession(user);

    return Response.json(
      { user: { id: user.id, username: user.username } },
      {
        headers: {
          ...CORS,
          'Set-Cookie': buildSessionCookie(session),
        },
      }
    );
  } catch {
    return Response.json({ error: 'Solicitud invalida' }, { status: 400, headers: CORS });
  }
}
