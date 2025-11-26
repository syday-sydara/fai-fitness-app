import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Weight from "@/models/Weight";

// GET /api/weights?userId=alex123
export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const weights = await Weight.find({ userId }).sort({ date: -1 }).limit(50);
    return NextResponse.json({ success: true, data: weights });
  } catch (err: any) {
    const errorMsg = process.env.NODE_ENV === "development" ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

// POST /api/weights
export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, weight } = body;

    if (!userId || typeof weight !== "number") {
      return NextResponse.json({ success: false, error: "Invalid or missing fields" }, { status: 400 });
    }

    const entry = await Weight.create({ userId, weight });
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (err: any) {
    const errorMsg = process.env.NODE_ENV === "development" ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}