import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
  }

  try {
    const [workouts, weights] = await Promise.all([
      prisma.workout.findMany({ where: { userId }, orderBy: { date: "desc" } }),
      prisma.weight.findMany({ where: { userId }, orderBy: { date: "desc" } }),
    ]);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentWorkouts = workouts.filter((w) => new Date(w.date) > sevenDaysAgo);

    const readinessScore = Math.min(10, 5 + recentWorkouts.length);

    const trend = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(Date.now() - i * 86400000);
      const dayWorkouts = workouts.filter(
        (w) => new Date(w.date).toISOString().slice(0, 10) === day.toISOString().slice(0, 10)
      );
      const score = Math.min(10, 5 + dayWorkouts.length);
      return {
        date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score,
      };
    }).reverse();

    return NextResponse.json({ success: true, data: { workouts, weights, readinessScore, trend } });
  } catch (err) {
    console.error("Progress GET error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}