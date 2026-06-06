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
      include: { books: true },
    });

    if (!author) {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener autor" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: any = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.email !== undefined) data.email = body.email;
    if (body.bio !== undefined) data.bio = body.bio;
    if (body.nationality !== undefined) data.nationality = body.nationality;
    if (body.birthYear !== undefined) data.birthYear = body.birthYear;

    const author = await prisma.author.update({
      where: { id },
      data,
    });

    return NextResponse.json(author);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar autor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Autor eliminado correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar autor" },
      { status: 500 }
    );
  }
}