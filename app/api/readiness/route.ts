import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple readiness computation using recent workouts and weights
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") ?? "demo-user";

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const workouts = await prisma.workout.findMany({
      where: { userId, date: { gte: sevenDaysAgo } },
    });

    const weights = await prisma.weight.findMany({
      where: { userId, date: { gte: sevenDaysAgo } },
      orderBy: { date: "asc" },
    });

    const workoutsLast7 = workouts.length;
    const avgIntensity =
      workouts.length > 0
        ? Math.round(
            workouts.reduce((a, w) => {
              const map: Record<string, number> = { low: 3, moderate: 6, high: 8 };
              return a + (map[w.intensity] ?? 5);
            }, 0) / workouts.length
          )
        : 5;

    // Weight stability proxy
    let weightVariance = 0;
    if (weights.length > 1) {
      const vals = weights.map((w) => w.value);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      weightVariance =
        vals.reduce((a, v) => a + Math.pow(v - avg, 2), 0) / vals.length;
    }

    // Simple readiness formula
    const loadPenalty = Math.max(0, avgIntensity - 6) + Math.max(0, workoutsLast7 - 4);
    const variancePenalty = weightVariance > 1 ? 1 : 0; // if >1 kg variance, small penalty
    const base = 8 - (loadPenalty + variancePenalty);
    const score = Math.max(1, Math.min(10, Math.round(base)));

    return NextResponse.json({ success: true, score });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Failed to compute readiness" }, { status: 500 });
  }
}