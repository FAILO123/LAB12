import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");

    const books = await prisma.book.findMany({
      where: genre ? { genre } : {},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener libros" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const book = await prisma.book.create({
      data: {
        title: body.title,
        description: body.description,
        isbn: body.isbn,
        publishedYear: body.publishedYear,
        genre: body.genre,
        pages: body.pages,
        authorId: body.authorId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "El ISBN ya existe" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear libro" },
      { status: 500 }
    );
  }
}