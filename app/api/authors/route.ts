import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      include: {
        books: true,
      },
    });

    return NextResponse.json(authors);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener autores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const author = await prisma.author.create({
      data: {
        name: body.name,
        email: body.email,
        bio: body.bio,
        nationality: body.nationality,
        birthYear: body.birthYear,
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear autor" },
      { status: 500 }
    );
  }
}