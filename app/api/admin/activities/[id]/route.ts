// app/api/admin/activities/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { MediaType } from "@prisma/client";

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
    const rating = parseFloat(formData.get("rating") as string) || 0;
    const latitude = parseFloat(formData.get("latitude") as string) || null;
    const longitude = parseFloat(formData.get("longitude") as string) || null;
    const amenities = JSON.parse(formData.get("amenities") as string);
    const existingMedia = JSON.parse(formData.get("existingMedia") as string);
    const newMedia = formData.getAll("media") as File[];

    // Delete removed media
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const mediaToDelete = activity.images.filter(
      media => !existingMedia.find((m: any) => m.id === media.id)
    );

    // Delete files from Cloudinary
    for (const media of mediaToDelete) {
      const publicId = media.url.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`activities/${publicId}`);
      }
    }

    // Delete records from database
    await prisma.activityMedia.deleteMany({
      where: {
        id: {
          in: mediaToDelete.map(m => m.id)
        }
      }
    });

    // Upload new media files
    const mediaPromises = newMedia.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "activities" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(Buffer.from(buffer));
      });

      return prisma.activityMedia.create({
        data: {
          url: (result as any).secure_url,
          type: file.type.startsWith('image/') ? MediaType.IMAGE : MediaType.VIDEO,
          activityId: id,
        },
      });
    });

    await Promise.all(mediaPromises);

    // Update activity
    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: {
        name,
        category,
        location,
        description,
        price,
        rating,
        latitude,
        longitude,
        amenities,
      },
      include: {
        images: true
      },
    });

    return NextResponse.json(updatedActivity, { status: 200 });
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
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { images: true },
    });

    if (activity) {
      // Delete all images from Cloudinary
      const deletePromises = [activity.image, ...activity.images.map(img => img.url)]
        .map(url => {
          const publicId = url.split('/').pop()?.split('.')[0];
          if (publicId) {
            return cloudinary.uploader.destroy(`activities/${publicId}`);
          }
          return Promise.resolve();
        });

      await Promise.all(deletePromises);

      // Delete from database
      await prisma.activity.delete({
        where: { id },
      });
    }

    return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}