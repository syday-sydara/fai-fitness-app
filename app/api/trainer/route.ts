import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workout from "@/models/Workout";
import Weight from "@/models/Weight";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  // Fetch recent data
  const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(5);
  const weights = await Weight.find({ userId }).sort({ date: -1 }).limit(5);

  // Simple AI logic (replace with ML/LLM later)
  let message = "Let's crush it today!";
  if (workouts.length && workouts[0].rpe > 8) {
    message = "You pushed hard yesterday — keep today's session lighter.";
  } else if (weights.length && weights[0].weight > weights[weights.length - 1].weight) {
    message = "Weight is trending up — focus on consistency and recovery.";
  }

  return NextResponse.json({ message });
}