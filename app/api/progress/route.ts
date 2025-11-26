import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")!;

  try {
    const workouts = await prisma.workout.findMany({ where: { userId } });
    const weights = await prisma.weight.findMany({ where: { userId } });

    return NextResponse.json({ success: true, workouts, weights });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load progress data" });
  }
}