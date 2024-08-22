// app/api/admin/activities/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !(await prisma.user.findUnique({ where: { id: session.user.id } }))?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const amenities = JSON.parse(formData.get("amenities") as string);
    const image = formData.get("image") as File | null;

    let imagePath = undefined;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const imageName = `${Date.now()}-${image.name}`;
      imagePath = path.join(process.cwd(), "public", "uploads", imageName);
      await writeFile(imagePath, buffer);
      imagePath = `/uploads/${imageName}`;
    }

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        name,
        category,
        location,
        description,
        price,
        amenities,
        ...(imagePath && { image: imagePath }),
      },
    });

    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    console.error("Failed to update activity:", error);
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !(await prisma.user.findUnique({ where: { id: session.user.id } }))?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}