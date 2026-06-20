import { todos } from '@/lib/store';

/**
 * FIX V1 (Reflected XSS / A03):
 * El valor `q` se renderiza mediante JSX normal. React escapa el contenido por
 * defecto, por lo que un payload como <script>alert(1)</script> se muestra como
 * texto y no se interpreta como HTML ejecutable.
 */
export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = String(sp?.q ?? '');
  const results = todos.filter((t) =>
    t.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="container">
      <h1>Buscar tareas</h1>

      <form method="get" className="search-form">
        <input name="q" placeholder="Buscar..." />
        <button type="submit">Buscar</button>
      </form>

      <p>Resultados para: <b>{q}</b></p>

      <ul>
        {results.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>

      <p><a href="/">Volver al inicio</a></p>
    </main>
  );
}
