import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";

export async function GET() {
  await connectDB();
  const workouts = await Workout.find().sort({ date: 1 });
  return NextResponse.json(workouts);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const workout = new Workout(body);
  await workout.save();
  return NextResponse.json(workout);
}
