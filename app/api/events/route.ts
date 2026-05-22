import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    // ✅ Convert form data to object
    const event = Object.fromEntries(formData.entries());

    // ✅ Get uploaded image
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    // ✅ Parse tags & agenda safely
    let tags: string[] = [];
    let agenda: string[] = [];

    try {
      tags = JSON.parse(formData.get("tags") as string);
      agenda = JSON.parse(formData.get("agenda") as string);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid tags or agenda format" },
        { status: 400 }
      );
    }

    // ✅ Convert image to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload image to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "DevEvent",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            return reject(error);
          }

          resolve(result);
        }
      );

      stream.end(buffer);
    });

    // ✅ Create event in MongoDB
    const createdEvent = await Event.create({
      ...event,
      image: uploadResult.secure_url,
      tags,
      agenda,
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("EVENT CREATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Events fetched successfully",
        events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return NextResponse.json(
      {
        message: "Event fetching failed",
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}