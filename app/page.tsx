"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    nationality: "",
    birthYear: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadAuthors() {
    const res = await fetch("/api/authors");
    const data = await res.json();
    setAuthors(data);
  }

  async function saveAuthor(e: any) {
    e.preventDefault();

    await fetch(editingId ? `/api/authors/${editingId}` : "/api/authors", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        birthYear: form.birthYear ? Number(form.birthYear) : undefined,
      }),
    });

    setForm({ name: "", email: "", bio: "", nationality: "", birthYear: "" });
    setEditingId(null);
    loadAuthors();
  }

  async function deleteAuthor(id: string) {
    if (!confirm("¿Eliminar este autor?")) return;
    await fetch(`/api/authors/${id}`, { method: "DELETE" });
    loadAuthors();
  }

  function editAuthor(author: any) {
    setEditingId(author.id);
    setForm({
      name: author.name || "",
      email: author.email || "",
      bio: author.bio || "",
      nationality: author.nationality || "",
      birthYear: author.birthYear?.toString() || "",
    });
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  const totalBooks = authors.reduce((sum, a) => sum + (a.books?.length || 0), 0);

  return (
    <main className="min-h-screen bg-[#070B18] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <nav className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Biblioteca Digital
            </h1>
            <p className="text-slate-400 mt-2">
              Gestión de autores, libros y estadísticas con Next.js + Prisma + Supabase
            </p>
          </div>

          <a
            href="/books"
            className="bg-purple-600 hover:bg-purple-500 px-5 py-3 rounded-xl font-bold shadow-lg"
          >
            Ver libros
          </a>
        </nav>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#11182B] border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
            <p className="text-slate-400">Autores registrados</p>
            <h2 className="text-4xl font-black text-cyan-400">{authors.length}</h2>
          </div>

          <div className="bg-[#11182B] border border-purple-500/30 rounded-2xl p-6 shadow-xl">
            <p className="text-slate-400">Libros registrados</p>
            <h2 className="text-4xl font-black text-purple-400">{totalBooks}</h2>
          </div>

          <div className="bg-[#11182B] border border-green-500/30 rounded-2xl p-6 shadow-xl">
            <p className="text-slate-400">Estado de API</p>
            <h2 className="text-4xl font-black text-green-400">Activa</h2>
          </div>
        </section>

        <section className="bg-[#11182B] border border-slate-700 rounded-2xl p-8 mb-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">
            {editingId ? "Editar autor" : "Crear nuevo autor"}
          </h2>

          <form onSubmit={saveAuthor} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" placeholder="Nacionalidad" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
            <input className="input" placeholder="Año de nacimiento" value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} />
            <textarea className="input md:col-span-2 min-h-24" placeholder="Biografía" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />

            <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl p-4">
              {editingId ? "Actualizar autor" : "Crear autor"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", email: "", bio: "", nationality: "", birthYear: "" });
              }}
              className="bg-slate-700 hover:bg-slate-600 font-bold rounded-xl p-4"
            >
              Limpiar
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Autores</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {authors.map((author) => (
              <article
                key={author.id}
                className="bg-[#11182B] border border-slate-700 rounded-2xl p-6 shadow-xl hover:border-cyan-400 transition"
              >
                <h3 className="text-2xl font-black text-cyan-300">{author.name}</h3>
                <p className="text-slate-400">{author.email}</p>
                <p className="mt-4 text-slate-200">{author.bio || "Sin biografía"}</p>

                <div className="mt-4 flex gap-3 text-sm text-slate-400">
                  <span>{author.nationality || "Sin país"}</span>
                  <span>•</span>
                  <span>{author.birthYear || "Sin año"}</span>
                  <span>•</span>
                  <span>{author.books?.length || 0} libros</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <a className="btn bg-green-600 hover:bg-green-500 text-center" href={`/authors/${author.id}`}>
                    Ver detalle
                  </a>

                  <a className="btn bg-blue-600 hover:bg-blue-500 text-center" href={`/authors/${author.id}`}>
                    Ver libros
                  </a>

                  <button className="btn bg-yellow-600 hover:bg-yellow-500" onClick={() => editAuthor(author)}>
                    Editar
                  </button>

                  <button className="btn bg-red-600 hover:bg-red-500" onClick={() => deleteAuthor(author.id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}