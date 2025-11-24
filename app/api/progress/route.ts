import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
  }

  const [workouts, weights] = await Promise.all([
    prisma.workout.findMany({ where: { userId }, orderBy: { date: "desc" } }),
    prisma.weight.findMany({ where: { userId }, orderBy: { date: "desc" } }),
  ]);

  return NextResponse.json({ success: true, workouts, weights });
}