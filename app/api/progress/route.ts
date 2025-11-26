import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // cached Prisma client

// GET: fetch workouts + weights
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Missing userId" },
      { status: 400 }
    );
  }

  try {
    const [workouts, weights] = await Promise.all([
      prisma.workout.findMany({
        where: { userId },
        orderBy: { date: "desc" },
      }),
      prisma.weight.findMany({
        where: { userId },
        orderBy: { date: "desc" },
      }),
    ]);

    return NextResponse.json({ success: true, data: { workouts, weights } });
  } catch (err) {
    console.error("Progress API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: log new workout or weight
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, userId, date, sets, reps, rpe, weight } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { success: false, error: "Missing userId or type" },
        { status: 400 }
      );
    }

    let record;
    if (type === "workout") {
      if (!sets || !reps || !rpe) {
        return NextResponse.json(
          { success: false, error: "Missing workout fields" },
          { status: 400 }
        );
      }
      record = await prisma.workout.create({
        data: {
          userId,
          date: date ? new Date(date) : new Date(),
          sets,
          reps,
          rpe,
          weight,
        },
      });
    } else if (type === "weight") {
      if (!weight) {
        return NextResponse.json(
          { success: false, error: "Missing weight value" },
          { status: 400 }
        );
      }
      record = await prisma.weight.create({
        data: {
          userId,
          date: date ? new Date(date) : new Date(),
          weight,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (err) {
    console.error("Progress POST error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}