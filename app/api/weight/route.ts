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
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const weights = await Weight.find({ userId }).sort({ date: -1 });
    return NextResponse.json({ success: true, data: weights });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// POST /api/weights
export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, weight } = body;

    if (!userId || !weight) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const entry = await Weight.create({
      userId,
      weight,
      date: new Date(),
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}