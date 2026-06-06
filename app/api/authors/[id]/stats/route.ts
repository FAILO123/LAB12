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

    const books = author.books;

    const booksWithYear = books.filter((book) => book.publishedYear !== null);
    const booksWithPages = books.filter((book) => book.pages !== null);

    const firstBook = booksWithYear.sort(
      (a, b) => (a.publishedYear || 0) - (b.publishedYear || 0)
    )[0];

    const latestBook = booksWithYear.sort(
      (a, b) => (b.publishedYear || 0) - (a.publishedYear || 0)
    )[0];

    const longestBook = booksWithPages.sort(
      (a, b) => (b.pages || 0) - (a.pages || 0)
    )[0];

    const shortestBook = booksWithPages.sort(
      (a, b) => (a.pages || 0) - (b.pages || 0)
    )[0];

    const averagePages =
      booksWithPages.length > 0
        ? Math.round(
            booksWithPages.reduce((sum, book) => sum + (book.pages || 0), 0) /
              booksWithPages.length
          )
        : 0;

    const genres = [...new Set(books.map((book) => book.genre).filter(Boolean))];

    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks: books.length,
      firstBook: firstBook
        ? { title: firstBook.title, year: firstBook.publishedYear }
        : null,
      latestBook: latestBook
        ? { title: latestBook.title, year: latestBook.publishedYear }
        : null,
      averagePages,
      genres,
      longestBook: longestBook
        ? { title: longestBook.title, pages: longestBook.pages }
        : null,
      shortestBook: shortestBook
        ? { title: shortestBook.title, pages: shortestBook.pages }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}