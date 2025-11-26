// app/api/progress/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
  }

  try {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    // Example readiness formula: base 5 + recent workouts count (capped at 10)
    const recentWorkouts = workouts.filter(
      (w) => new Date(w.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const readinessScore = Math.min(10, 5 + recentWorkouts.length);

    // Trend: group workouts by day and assign scores
    const trend = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayWorkouts = workouts.filter(
        (w) => new Date(w.date).toDateString() === day.toDateString()
      );
      const score = Math.min(10, 5 + dayWorkouts.length);
      return { date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }), score };
    }).reverse();

    return NextResponse.json({ success: true, data: { readinessScore, trend, workouts } });
  } catch (err) {
    console.error("Progress API error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}