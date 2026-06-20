import { readFileSync } from 'fs';
import { resolve } from 'path';
import { CORS } from '@/lib/store';

/**
 * FIX V2 (Path Traversal / A01):
 * El parametro `name` ya no se concatena directamente con una ruta del sistema.
 * Se usa una allowlist estatica de archivos permitidos dentro de data/notes.
 */
const NOTES_DIR = resolve(process.cwd(), 'data', 'notes');

function readAllowedNote(name) {
  switch (name) {
    case 'bienvenida.txt':
      return readFileSync(resolve(NOTES_DIR, 'bienvenida.txt'), 'utf-8');
    case 'plantilla-tarea.txt':
      return readFileSync(resolve(NOTES_DIR, 'plantilla-tarea.txt'), 'utf-8');
    default:
      return null;
  }
}

export async function GET(req) {
  const name = new URL(req.url).searchParams.get('name') || 'bienvenida.txt';

  try {
    const content = readAllowedNote(name);
    if (content === null) {
      return new Response('Archivo no permitido', {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
      });
    }

    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
    });
  } catch {
    return new Response('Archivo no encontrado', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
    });
  }
}
