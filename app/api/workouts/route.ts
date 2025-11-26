import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

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
  if (!body.userId || !body.date) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }
  const workout = { id: randomUUID(), ...body };
  workouts.push(workout);
  return NextResponse.json({ success: true, data: workout });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }

  const index = workouts.findIndex((w) => w.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: "Workout not found" }, { status: 404 });
  }

  workouts.splice(index, 1);
  return NextResponse.json({ success: true, message: "Workout deleted" });
}