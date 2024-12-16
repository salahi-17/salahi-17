import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { MediaType } from "@prisma/client";
import { UploadApiOptions } from 'cloudinary';

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
    const rating = parseFloat(formData.get("rating") as string) || 0;
    const latitude = parseFloat(formData.get("latitude") as string) || null;
    const longitude = parseFloat(formData.get("longitude") as string) || null;
    const amenities = JSON.parse(formData.get("amenities") as string);
    const media = formData.getAll("media") as File[];

    if (media.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    // WebP optimization options for images
    const imageUploadOptions: UploadApiOptions = {
      resource_type: "image", // This ensures that the resource is treated as an image
      folder: "activities",
      transformation: [
        {
          format: "webp",  // Force the image to be converted to WebP
          quality: "auto", // Automatic quality adjustment for optimal file size
          fetch_format: "webp",  // Explicitly set the fetch format to WebP
        },
      ],
    };

    // Video upload options (no format transformation, keep as original format)
    const videoUploadOptions: UploadApiOptions = {
      resource_type: "video", // This ensures the resource is treated as a video
      folder: "activities",
      // You can add additional transformations for videos if needed (e.g., format conversion to .mp4)
    };

    // Upload the main image (first image in the media array)
    const mainImageFile = media[0];
    const mainImageBuffer = await mainImageFile.arrayBuffer();
    const mainImageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        imageUploadOptions,
        (error, result) => {
          if (error) {
            console.error("Error uploading main image:", error);
            reject(error);
          } else {
            console.log("Main image uploaded successfully:", result);
            resolve(result);
          }
        }
      ).end(Buffer.from(mainImageBuffer));
    });

    // Create activity with main image URL
    const activity = await prisma.activity.create({
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
        image: (mainImageResult as any).secure_url,  // Store main image URL
        totalRatings: 0,
      },
    });

    // Upload remaining media files (images or videos)
    const mediaPromises = media.slice(1).map(async (file) => {
      const buffer = await file.arrayBuffer();
      const uploadOptions = file.type.startsWith('image/') ? imageUploadOptions : videoUploadOptions;

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error(`Error uploading media file (${file.name}):`, error);
              reject(error);
            } else {
              console.log(`Media file (${file.name}) uploaded successfully:`, result);
              resolve(result);
            }
          }
        ).end(Buffer.from(buffer));
      });

      // Save the media URL to the database (whether it's an image or video)
      return prisma.activityMedia.create({
        data: {
          url: (result as any).secure_url,
          type: file.type.startsWith('image/') ? MediaType.IMAGE : MediaType.VIDEO,
          activityId: activity.id,
        },
      });
    });

    await Promise.all(mediaPromises);

    // Retrieve the complete activity object with media URLs
    const completeActivity = await prisma.activity.findUnique({
      where: { id: activity.id },
      include: { images: true },
    });

    return NextResponse.json(completeActivity, { status: 201 });
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
    const activities = await prisma.activity.findMany({
      include: {
        images: true,
      },
    });
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
