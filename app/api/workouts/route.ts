import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Workout from "../../../models/Workout";

function validateWorkoutInput(body: any) {
  if (!body.sets || body.sets < 1 || body.sets > 20) {
    return "Sets must be between 1 and 20";
  }
  if (!body.reps || body.reps < 1 || body.reps > 50) {
    return "Reps must be between 1 and 50";
  }
  if (!body.rpe || body.rpe < 1 || body.rpe > 10) {
    return "RPE must be between 1 and 10";
  }
  if (!body.date) {
    return "Date is required";
  }
  return null;
}

export async function GET() {
  try {
    await connectDB();
    const workouts = await Workout.find().sort({ date: 1 });
    return NextResponse.json({ success: true, data: workouts, error: null });
  } catch (err: any) {
    return NextResponse.json({ success: false, data: null, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const validationError = validateWorkoutInput(body);
    if (validationError) {
      return NextResponse.json({ success: false, data: null, error: validationError }, { status: 400 });
    }

    const workout = new Workout(body);
    await workout.save();
    return NextResponse.json({ success: true, data: workout, error: null });
  } catch (err: any) {
    return NextResponse.json({ success: false, data: null, error: err.message }, { status: 500 });
  }
}
