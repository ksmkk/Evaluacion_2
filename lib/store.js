import { createHash, randomBytes, timingSafeEqual } from 'crypto';

/**
 * lib/store.js
 * Almacen EN MEMORIA (sin base de datos). Se reinicia al reiniciar el server.
 */

export const users = [
  {
    id: 1,
    username: 'alice',
    passwordHash: '4e40e8ffe0ee32fa53e139147ed559229a5930f89c2204706fc174beb36210b3',
  },
  {
    id: 2,
    username: 'bob',
    passwordHash: '8d059c3640b97180dd2ee453e20d34ab0cb0f2eccbe87d01915a8e578a202b11',
  },
];

export function verifyPassword(user, password) {
  const expected = Buffer.from(user.passwordHash, 'hex');
  const candidate = createHash('sha256').update(String(password)).digest();
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

export const todos = [
  { id: 101, ownerId: 1, title: 'Comprar café', done: false },
  { id: 102, ownerId: 1, title: 'Pagar el arriendo', done: false },
  { id: 103, ownerId: 2, title: 'Llamar al dentista', done: true },
];

let _nextId = 200;
export function nextTodoId() {
  return _nextId++;
}

const sessions = new Map();

// Sesion opaca: el cliente recibe un identificador aleatorio de alta entropia y
// los datos reales de sesion quedan en memoria del servidor.
export function makeSession(user) {
  const token = randomBytes(32).toString('hex');
  sessions.set(token, { id: user.id, username: user.username });
  return token;
}

export function readSession(req) {
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) return null;
  return sessions.get(decodeURIComponent(m[1])) || null;
}

// CORS queda cerrado por defecto. Las rutas siguen importando este objeto para
// mantener cambios minimos sin exponer Access-Control-Allow-Origin: *.
export const CORS = {};
