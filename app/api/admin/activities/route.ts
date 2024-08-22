// app/api/admin/activities/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !(await prisma.user.findUnique({ where: { id: session.user.id } }))?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const amenities = JSON.parse(formData.get("amenities") as string);
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageName = `${Date.now()}-${image.name}`;
    const imagePath = path.join(process.cwd(), "public", "uploads", imageName);
    await writeFile(imagePath, buffer);

    const activity = await prisma.activity.create({
      data: {
        name,
        category,
        location,
        description,
        price,
        amenities,
        image: `/uploads/${imageName}`,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Failed to create activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !(await prisma.user.findUnique({ where: { id: session.user.id } }))?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const activities = await prisma.activity.findMany();
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}