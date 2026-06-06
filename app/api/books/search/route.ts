import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const authorName = searchParams.get("authorName") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limitParam = Number(searchParams.get("limit")) || 10;
    const limit = Math.min(limitParam, 50);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        search
          ? { title: { contains: search, mode: "insensitive" } }
          : {},
        genre
          ? { genre: genre }
          : {},
        authorName
          ? { author: { name: { contains: authorName, mode: "insensitive" } } }
          : {},
      ],
    };

    const total = await prisma.book.count({ where });

    const books = await prisma.book.findMany({
      where,
      include: {
        author: true,
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}