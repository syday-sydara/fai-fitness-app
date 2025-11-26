import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const workout = await prisma.workout.create({ data: body });
    return NextResponse.json({ success: true, workout });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to log workout" });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")!;
  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
  });
  return NextResponse.json({ success: true, workouts });
}