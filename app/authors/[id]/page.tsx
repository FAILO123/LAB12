"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AuthorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [author, setAuthor] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    nationality: "",
    birthYear: "",
  });

  const [bookForm, setBookForm] = useState({
    title: "",
    description: "",
    isbn: "",
    publishedYear: "",
    genre: "",
    pages: "",
  });

  async function loadData() {
    try {
      setLoading(true);

      const authorRes = await fetch(`/api/authors/${id}`);
      const authorData = await authorRes.json();

      const statsRes = await fetch(`/api/authors/${id}/stats`);
      const statsData = await statsRes.json();

      if (!authorRes.ok) {
        setMessage(authorData.error || "Autor no encontrado");
        setAuthor(null);
        return;
      }

      setAuthor(authorData);
      setStats(statsData);

      setForm({
        name: authorData.name || "",
        email: authorData.email || "",
        bio: authorData.bio || "",
        nationality: authorData.nationality || "",
        birthYear: authorData.birthYear?.toString() || "",
      });
    } catch (error) {
      setMessage("Error al cargar la información del autor");
    } finally {
      setLoading(false);
    }
  }

  async function updateAuthor(e: any) {
    e.preventDefault();

    await fetch(`/api/authors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        bio: form.bio,
        nationality: form.nationality,
        birthYear: form.birthYear ? Number(form.birthYear) : undefined,
      }),
    });

    setMessage("Autor actualizado correctamente");
    loadData();
  }

  async function createBook(e: any) {
    e.preventDefault();

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: bookForm.title,
        description: bookForm.description,
        isbn: bookForm.isbn,
        publishedYear: bookForm.publishedYear ? Number(bookForm.publishedYear) : undefined,
        genre: bookForm.genre,
        pages: bookForm.pages ? Number(bookForm.pages) : undefined,
        authorId: id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Error al crear libro");
      return;
    }

    setBookForm({
      title: "",
      description: "",
      isbn: "",
      publishedYear: "",
      genre: "",
      pages: "",
    });

    setMessage("Libro agregado correctamente");
    loadData();
  }

  async function deleteBook(bookId: string) {
    if (!confirm("¿Eliminar este libro?")) return;

    await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
    });

    setMessage("Libro eliminado correctamente");
    loadData();
  }

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070B18] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-3xl font-black text-cyan-400">Cargando autor...</h1>
        </div>
      </main>
    );
  }

  if (!author) {
    return (
      <main className="min-h-screen bg-[#070B18] text-white flex items-center justify-center px-6">
        <div className="bg-[#11182B] border border-red-500/40 rounded-2xl p-8 max-w-xl text-center">
          <h1 className="text-4xl font-black text-red-400">Autor no encontrado</h1>
          <p className="text-slate-300 mt-4">{message}</p>
          <a
            href="/"
            className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-3 rounded-xl"
          >
            Volver al dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070B18] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <nav className="flex justify-between items-center mb-8">
          <a href="/" className="text-cyan-400 hover:underline font-bold">
            ← Volver al dashboard
          </a>

          <a
            href="/books"
            className="bg-purple-600 hover:bg-purple-500 px-5 py-3 rounded-xl font-bold"
          >
            Ir a libros
          </a>
        </nav>

        <header className="bg-gradient-to-r from-[#11182B] to-[#151B35] border border-slate-700 rounded-3xl p-8 mb-8 shadow-2xl">
          <p className="text-cyan-400 font-bold mb-2">Detalle del autor</p>
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {author.name}
          </h1>
          <p className="text-slate-400 mt-2">{author.email}</p>

          <div className="flex gap-3 flex-wrap mt-5">
            <span className="bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-4 py-2 rounded-full">
              {author.nationality || "Sin nacionalidad"}
            </span>
            <span className="bg-purple-500/10 border border-purple-400/30 text-purple-300 px-4 py-2 rounded-full">
              {author.birthYear || "Sin año"}
            </span>
          </div>

          <p className="text-slate-200 mt-6 leading-relaxed">
            {author.bio || "Sin biografía registrada."}
          </p>
        </header>

        {message && (
          <div className="bg-green-500/10 border border-green-400/30 text-green-300 rounded-xl p-4 mb-8">
            {message}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p>Total libros</p>
            <h2>{stats?.totalBooks || 0}</h2>
          </div>

          <div className="card">
            <p>Promedio páginas</p>
            <h2>{stats?.averagePages || 0}</h2>
          </div>

          <div className="card">
            <p>Primer libro</p>
            <h2>{stats?.firstBook?.year || "-"}</h2>
          </div>

          <div className="card">
            <p>Último libro</p>
            <h2>{stats?.latestBook?.year || "-"}</h2>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#11182B] border border-slate-700 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-black mb-6 text-cyan-300">
              Editar información
            </h2>

            <form onSubmit={updateAuthor} className="grid grid-cols-1 gap-5">
              <input
                className="input"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                className="input"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <input
                className="input"
                placeholder="Nacionalidad"
                value={form.nationality}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
              />

              <input
                className="input"
                placeholder="Año de nacimiento"
                value={form.birthYear}
                onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
              />

              <textarea
                className="input min-h-28"
                placeholder="Biografía"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />

              <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl p-4">
                Actualizar autor
              </button>
            </form>
          </div>

          <div className="bg-[#11182B] border border-slate-700 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-black mb-6 text-purple-300">
              Agregar nuevo libro
            </h2>

            <form onSubmit={createBook} className="grid grid-cols-1 gap-5">
              <input
                className="input"
                placeholder="Título"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                required
              />

              <input
                className="input"
                placeholder="ISBN"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                required
              />

              <input
                className="input"
                placeholder="Género"
                value={bookForm.genre}
                onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  className="input"
                  placeholder="Año"
                  value={bookForm.publishedYear}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, publishedYear: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Páginas"
                  value={bookForm.pages}
                  onChange={(e) => setBookForm({ ...bookForm, pages: e.target.value })}
                />
              </div>

              <textarea
                className="input min-h-28"
                placeholder="Descripción"
                value={bookForm.description}
                onChange={(e) =>
                  setBookForm({ ...bookForm, description: e.target.value })
                }
              />

              <button className="bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl p-4">
                Agregar libro
              </button>
            </form>
          </div>
        </section>

        <section className="bg-[#11182B] border border-slate-700 rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-black mb-6">Libros del autor</h2>

          {author.books?.length === 0 ? (
            <p className="text-slate-400">
              Este autor todavía no tiene libros registrados.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {author.books.map((book: any) => (
                <article
                  key={book.id}
                  className="bg-[#070B18] border border-slate-700 rounded-2xl p-6 hover:border-purple-400 transition"
                >
                  <h3 className="text-2xl font-black text-purple-300">
                    {book.title}
                  </h3>

                  <p className="text-slate-400 mt-2">
                    {book.description || "Sin descripción"}
                  </p>

                  <div className="mt-4 space-y-1 text-slate-300">
                    <p>ISBN: {book.isbn}</p>
                    <p>Género: {book.genre}</p>
                    <p>Año: {book.publishedYear}</p>
                    <p>Páginas: {book.pages}</p>
                  </div>

                  <button
                    onClick={() => deleteBook(book.id)}
                    className="mt-5 bg-red-600 hover:bg-red-500 w-full rounded-xl p-3 font-black"
                  >
                    Eliminar libro
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}