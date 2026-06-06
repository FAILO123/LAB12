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