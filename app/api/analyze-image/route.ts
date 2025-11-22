import { NextResponse } from "next/server";
import { analyzeImageWithLLM } from "@/lib/image-analyzer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    
    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(image.type)) {
      return NextResponse.json(
        { error: "Invalid image type. Please upload JPEG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: "Image size exceeds 10MB limit" },
        { status: 400 }
      );
    }
    
    // Convert to base64
    const buffer = await image.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    
    // Analyze with LLM
    const result = await analyzeImageWithLLM(base64, image.type);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze image" },
      { status: 500 }
    );
  }
}

