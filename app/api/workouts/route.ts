import { NextResponse } from "next/server";

// Temporary in-memory store (replace with DB later)
let workouts: any[] = [];

export async function GET() {
  return NextResponse.json(workouts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newWorkout = { ...body, id: Date.now() };
  workouts.push(newWorkout);
  return NextResponse.json(newWorkout);
}
