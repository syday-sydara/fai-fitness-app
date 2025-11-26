import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workout from "@/models/Workout";
import Weight from "@/models/Weight";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const goal = searchParams.get("goal") || "general";

  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
  }

  try {
    const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(5);
    const weights = await Weight.find({ userId }).sort({ date: -1 }).limit(5);

    let plan: string[];

    switch (goal) {
      case "strength":
        plan = ["Warm-up: mobility", "5x5 squats", "5x5 bench press", "Pull-ups", "Cool-down stretch"];
        break;
      case "endurance":
        plan = ["Warm-up jog", "Intervals: 6x2 min run / 1 min walk", "Core circuit", "Stretch"];
        break;
      default:
        plan = ["Warm-up", "Full-body circuit: push-ups, lunges, rows", "Plank hold", "Stretch"];
    }

    // Adjust intensity if last workout had high RPE
    if (workouts.length && workouts[0].rpe >= 8) {
      plan = ["Active recovery: yoga, light cardio, stretching"];
    }

    return NextResponse.json({ success: true, data: { plan, workouts, weights } });
  } catch (err) {
    console.error("GET /plan error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}