// app/api/admin/activities/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

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

    let imageUrl = undefined;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "activities" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      imageUrl = (result as any).secure_url;

      // Delete old image if it exists
      const oldActivity = await prisma.activity.findUnique({ where: { id } });
      if (oldActivity?.image) {
        const publicId = oldActivity.image.split('/').pop()?.split('.')[0];
        await cloudinary.uploader.destroy(`activities/${publicId}`);
      }
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
        ...(imageUrl && { image: imageUrl }),
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
    const activity = await prisma.activity.findUnique({ where: { id } });

    if (activity?.image) {
      const publicId = activity.image.split('/').pop()?.split('.')[0];
      await cloudinary.uploader.destroy(`activities/${publicId}`);
    }

    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}