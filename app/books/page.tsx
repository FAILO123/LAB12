"use client";

import { useEffect, useState } from "react";

export default function BooksPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    authorName: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
  });

  const [pagination, setPagination] = useState<any>({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    isbn: "",
    publishedYear: "",
    genre: "",
    pages: "",
    authorId: "",
  });

  async function loadAuthors() {
    const res = await fetch("/api/authors");
    const data = await res.json();
    setAuthors(data);
  }

  async function loadBooks() {
    setLoading(true);

    const params = new URLSearchParams({
      search: filters.search,
      genre: filters.genre,
      authorName: filters.authorName,
      page: String(filters.page),
      limit: "6",
      sortBy: filters.sortBy,
      order: filters.order,
    });

    const res = await fetch(`/api/books/search?${params}`);
    const data = await res.json();

    setBooks(data.data || []);
    setPagination(data.pagination || {});
    setLoading(false);
  }

  async function createBook(e: any) {
    e.preventDefault();

    await fetch("/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        isbn: form.isbn,
        publishedYear: Number(form.publishedYear),
        genre: form.genre,
        pages: Number(form.pages),
        authorId: form.authorId,
      }),
    });

    setForm({
      title: "",
      description: "",
      isbn: "",
      publishedYear: "",
      genre: "",
      pages: "",
      authorId: "",
    });

    loadBooks();
  }

  async function deleteBook(id: string) {
    if (!confirm("¿Eliminar este libro?")) return;

    await fetch(`/api/books/${id}`, {
      method: "DELETE",
    });

    loadBooks();
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks();
    }, 400);

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <main className="min-h-screen bg-[#070B18] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <nav className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Gestión de Libros
            </h1>
            <p className="text-slate-400 mt-2">
              Búsqueda, filtros, paginación y registro de libros.
            </p>
          </div>

          <a href="/" className="bg-cyan-600 hover:bg-cyan-500 px-5 py-3 rounded-xl font-bold">
            Dashboard
          </a>
        </nav>

        <section className="bg-[#11182B] border border-slate-700 rounded-2xl p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">Crear libro</h2>

          <form onSubmit={createBook} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <input className="input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="input" placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
            <input className="input" placeholder="Género" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />

            <input className="input" placeholder="Año de publicación" value={form.publishedYear} onChange={(e) => setForm({ ...form, publishedYear: e.target.value })} />
            <input className="input" placeholder="Páginas" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} />

            <select className="input" value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })} required>
              <option value="">Seleccionar autor</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>

            <textarea className="input md:col-span-3 min-h-24" placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <button className="md:col-span-3 bg-purple-600 hover:bg-purple-500 rounded-xl p-4 font-black">
              Crear libro
            </button>
          </form>
        </section>

        <section className="bg-[#11182B] border border-slate-700 rounded-2xl p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">Buscar libros</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <input className="input" placeholder="Buscar por título" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />

            <input className="input" placeholder="Género exacto" value={filters.genre} onChange={(e) => setFilters({ ...filters, genre: e.target.value, page: 1 })} />

            <input className="input" placeholder="Autor" value={filters.authorName} onChange={(e) => setFilters({ ...filters, authorName: e.target.value, page: 1 })} />

            <select className="input" value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
              <option value="createdAt">Fecha creación</option>
              <option value="title">Título</option>
              <option value="publishedYear">Año</option>
            </select>

            <select className="input" value={filters.order} onChange={(e) => setFilters({ ...filters, order: e.target.value })}>
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </section>

        <div className="mb-6 text-slate-300">
          {loading ? "Buscando libros..." : `Total de resultados encontrados: ${pagination.total || 0}`}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {books.map((book) => (
            <article key={book.id} className="bg-[#11182B] border border-slate-700 rounded-2xl p-6 hover:border-purple-400 transition">
              <h3 className="text-2xl font-black text-purple-300">{book.title}</h3>
              <p className="text-slate-400 mt-2">{book.description}</p>

              <div className="mt-4 text-sm text-slate-300 space-y-1">
                <p>ISBN: {book.isbn}</p>
                <p>Género: {book.genre}</p>
                <p>Año: {book.publishedYear}</p>
                <p>Páginas: {book.pages}</p>
                <p className="text-cyan-300">Autor: {book.author?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <a href={`/api/books/${book.id}`} className="btn bg-green-600 text-center">
                  Ver JSON
                </a>
                <button className="btn bg-red-600" onClick={() => deleteBook(book.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </section>

        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            className="btn bg-slate-700"
            disabled={!pagination.hasPrev}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          >
            Anterior
          </button>

          <span className="text-slate-300">
            Página {pagination.page || 1} de {pagination.totalPages || 1}
          </span>

          <button
            className="btn bg-slate-700"
            disabled={!pagination.hasNext}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          >
            Siguiente
          </button>
        </div>
      </div>
    </main>
  );
}