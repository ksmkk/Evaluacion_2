import { readFileSync } from 'fs';
import { resolve, relative, sep } from 'path';
import { CORS } from '@/lib/store';

/**
 * FIX V2 (Path Traversal / A01):
 * Solo se permiten archivos conocidos dentro de data/notes. Ademas se resuelve
 * la ruta final y se verifica que siga confinada al directorio permitido.
 */
const NOTES_DIR = resolve(process.cwd(), 'data', 'notes');
const ALLOWED_FILES = new Set(['bienvenida.txt', 'plantilla-tarea.txt']);

function isInsideNotesDir(filePath) {
  const rel = relative(NOTES_DIR, filePath);
  return rel !== '' && !rel.startsWith('..') && !rel.startsWith(sep);
}

export async function GET(req) {
  const name = new URL(req.url).searchParams.get('name') || 'bienvenida.txt';

  if (!ALLOWED_FILES.has(name)) {
    return new Response('Archivo no permitido', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
    });
  }

  const filePath = resolve(NOTES_DIR, name);
  if (!isInsideNotesDir(filePath)) {
    return new Response('Ruta no permitida', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
    });
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
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
