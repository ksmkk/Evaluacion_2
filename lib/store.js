/**
 * lib/store.js
 * Almacen EN MEMORIA (sin base de datos). Se reinicia al reiniciar el server.
 */

export const users = [
  { id: 1, username: 'alice', password: 'alice123' },
  { id: 2, username: 'bob', password: 'bob123' },
];

export const todos = [
  { id: 101, ownerId: 1, title: 'Comprar café', done: false },
  { id: 102, ownerId: 1, title: 'Pagar el arriendo', done: false },
  { id: 103, ownerId: 2, title: 'Llamar al dentista', done: true },
];

let _nextId = 200;
export function nextTodoId() {
  return _nextId++;
}

// Sesion educativa en memoria/cookie para el laboratorio. La proteccion principal
// aplicada en la remediacion es el uso de flags seguros en la cookie.
export function makeSession(user) {
  return Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64');
}

export function readSession(req) {
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) return null;
  try {
    return JSON.parse(Buffer.from(decodeURIComponent(m[1]), 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

// CORS queda cerrado por defecto. Las rutas siguen importando este objeto para
// mantener cambios minimos sin exponer Access-Control-Allow-Origin: *.
export const CORS = {};
