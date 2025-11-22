import { NextResponse } from "next/server";
import { scrape } from "@/lib/scraper";

export const maxDuration = 60; // Allow 60 seconds for scraping

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    const result = await scrape(url);
    
    // Check if critical errors occurred
    if (result.debug.errors.length > 0 && !result.tokens) {
        return NextResponse.json(
            { error: "Scraping failed", details: result.debug.errors },
            { status: 500 }
        );
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Scraping API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

