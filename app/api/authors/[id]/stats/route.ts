import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!author) {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      );
    }

    const books = author.books || [];

    const booksWithYear = books.filter(
      (book: any) => book.publishedYear !== null
    );

    const booksWithPages = books.filter(
      (book: any) => book.pages !== null
    );

    const firstBook = [...booksWithYear].sort(
      (a: any, b: any) =>
        (a.publishedYear || 0) - (b.publishedYear || 0)
    )[0];

    const latestBook = [...booksWithYear].sort(
      (a: any, b: any) =>
        (b.publishedYear || 0) - (a.publishedYear || 0)
    )[0];

    const longestBook = [...booksWithPages].sort(
      (a: any, b: any) => (b.pages || 0) - (a.pages || 0)
    )[0];

    const shortestBook = [...booksWithPages].sort(
      (a: any, b: any) => (a.pages || 0) - (b.pages || 0)
    )[0];

    const averagePages =
      booksWithPages.length > 0
        ? Math.round(
            booksWithPages.reduce(
              (sum: number, book: any) => sum + (book.pages || 0),
              0
            ) / booksWithPages.length
          )
        : 0;

    const genres = Array.from(
      new Set(
        books
          .map((book: any) => book.genre)
          .filter((genre: any) => Boolean(genre))
      )
    );

    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks: books.length,
      firstBook: firstBook
        ? {
            title: firstBook.title,
            year: firstBook.publishedYear,
          }
        : null,
      latestBook: latestBook
        ? {
            title: latestBook.title,
            year: latestBook.publishedYear,
          }
        : null,
      averagePages,
      genres,
      longestBook: longestBook
        ? {
            title: longestBook.title,
            pages: longestBook.pages,
          }
        : null,
      shortestBook: shortestBook
        ? {
            title: shortestBook.title,
            pages: shortestBook.pages,
          }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al obtener estadísticas del autor" },
      { status: 500 }
    );
  }
}