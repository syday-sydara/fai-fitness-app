import { NextResponse } from "next/server";

// Temporary in-memory store
const workouts: any[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const userWorkouts = workouts.filter((w) => w.userId === userId);
  return NextResponse.json({ success: true, data: userWorkouts });
}

export async function POST(req: Request) {
  const body = await req.json();
  workouts.push(body);
  return NextResponse.json({ success: true });
}