import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workout from "@/models/Workout";

// GET /api/workouts
export async function GET(req: Request) {
  await dbConnect(); // ensure MongoDB connection

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const workouts = await Workout.find({ userId }).sort({ date: -1 });
    return NextResponse.json({ success: true, data: workouts });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// POST /api/workouts
export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, sets, reps, rpe, weight } = body;

    if (!userId || !sets || !reps || !rpe) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const workout = await Workout.create({
      userId,
      sets,
      reps,
      rpe,
      weight,
      date: new Date(),
    });

    return NextResponse.json({ success: true, data: workout });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}