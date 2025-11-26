import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workout from "@/models/Workout";

// GET /api/workouts
export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(50);
    return NextResponse.json({ success: true, data: workouts });
  } catch (err: any) {
    const errorMsg = process.env.NODE_ENV === "development" ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

// POST /api/workouts
export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, sets, reps, rpe, weight } = body;

    if (!userId || typeof sets !== "number" || typeof reps !== "number" || typeof rpe !== "number") {
      return NextResponse.json({ success: false, error: "Invalid or missing fields" }, { status: 400 });
    }

    if (weight && typeof weight !== "number") {
      return NextResponse.json({ success: false, error: "Weight must be a number" }, { status: 400 });
    }

    const workout = await Workout.create({ userId, sets, reps, rpe, weight });
    return NextResponse.json({ success: true, data: workout }, { status: 201 });
  } catch (err: any) {
    const errorMsg = process.env.NODE_ENV === "development" ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}