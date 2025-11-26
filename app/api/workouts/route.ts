import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
  const workouts = await prisma.workout.findMany({ where: { userId }, orderBy: { date: "desc" } });
  return NextResponse.json({ success: true, data: workouts });
}

export async function POST(req: Request) {
  try {
    const { userId, sets, reps, rpe, weight, date } = await req.json();
    if (!userId || !sets || !reps || !rpe) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    const workout = await prisma.workout.create({
      data: { userId, sets, reps, rpe, weight, date: date ? new Date(date) : new Date() },
    });
    return NextResponse.json({ success: true, data: workout }, { status: 201 });
  } catch (err) {
    console.error("Workout POST error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  await prisma.workout.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Deleted" });
}