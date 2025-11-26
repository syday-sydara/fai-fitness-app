import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Forecast = { description: string; avgTemp: number };

function pickFocus(readiness: number, goal?: string) {
  if (readiness <= 4) return "recovery";
  if (goal) return goal;
  return readiness >= 8 ? "strength" : readiness >= 6 ? "conditioning" : "cardio";
}

function indoorRequired(desc: string, temp: number) {
  const d = desc.toLowerCase();
  return d.includes("rain") || d.includes("snow") || temp < 5 || temp > 30;
}

function generateBlocks(focus: string, indoor: boolean, readiness: number) {
  const easy = readiness <= 4;
  const moderate = readiness <= 6;
  const hard = readiness >= 8;

  if (focus === "recovery") {
    return [
      { time: "Morning", title: "Gentle mobility", details: "10–15 min full-body mobility + breathing", duration: 15, intensity: "low" },
      { time: "Midday", title: "Active recovery", details: indoor ? "20–30 min easy bike/elliptical" : "30 min easy walk", duration: 30, intensity: "low" },
      { time: "Evening", title: "Stretch & unwind", details: "15 min yoga/stretching + hydration", duration: 15, intensity: "low" },
    ];
  }

  if (focus === "strength") {
    return [
      { time: "Morning", title: "Prep", details: "10 min dynamic warm-up + activation", duration: 10, intensity: "low" },
      { time: "Midday", title: "Strength session", details:
        hard
          ? "Squat 5x5, Bench 5x5, Row 4x8, Accessory core 10 min"
          : moderate
            ? "Squat 4x6, Push 4x8, Pull 4x8, Accessory 8 min"
            : "Full-body circuit: 3 rounds (goblet squat, push-ups, rows, RDLs), rest 60–90s",
        duration: hard ? 60 : moderate ? 45 : 35, intensity: hard ? "high" : moderate ? "moderate" : "low"
      },
      { time: "Evening", title: "Recovery", details: "10–15 min mobility + light walk", duration: 15, intensity: "low" },
    ];
  }

  if (focus === "hypertrophy") {
    return [
      { time: "Morning", title: "Priming", details: "10 min warm-up, band activation", duration: 10, intensity: "low" },
      { time: "Midday", title: "Volume work", details:
        "Upper/lower split: 3–4 sets x 8–12 reps across 6–8 movements; 60–90s rest; RPE 7–8",
        duration: 55, intensity: "moderate"
      },
      { time: "Evening", title: "Stretch", details: "15 min targeted mobility for trained muscle groups", duration: 15, intensity: "low" },
    ];
  }

  return [
    { time: "Morning", title: "Warm-up", details: "10 min easy cardio + mobility", duration: 10, intensity: "low" },
    { time: "Midday", title: indoor ? "Conditioning (indoor)" : "Conditioning (outdoor)", details:
      hard
        ? ( indoor ? "Bike intervals: 8x60s hard / 90s easy" : "Run intervals: 8x400m @ 5K pace, 200m jog" )
        : moderate
          ? ( indoor ? "Tempo: 20 min steady Z3" : "Run: 30–40 min Z2–Z3" )
          : ( indoor ? "Bike/row: 25 min Z2" : "Walk/jog: 30 min Z1–Z2" ),
      duration: hard ? 40 : moderate ? 35 : 30, intensity: hard ? "high" : moderate ? "moderate" : "low"
    },
    { time: "Evening", title: "Cooldown", details: "10–15 min stretching + breath work", duration: 15, intensity: "low" },
  ];
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, forecast, readiness, goal } = body as {
    userId: string;
    forecast?: Forecast | null;
    readiness: number;
    goal?: string;
  };

  const temp = forecast?.avgTemp ?? 20;
  const weatherDesc = forecast?.description ?? "clear";
  const indoor = indoorRequired(weatherDesc, temp);
  const focus = pickFocus(readiness, goal);
  const items = generateBlocks(focus, indoor, readiness);

  const notes =
    readiness <= 4
      ? "Low readiness — prioritizing recovery and gentle movement."
      : readiness >= 8
        ? "High readiness — pushing intensity while maintaining quality."
        : "Moderate readiness — focusing on sustainable work.";

  const plan = await prisma.workoutPlan.create({
    data: {
      userId,
      readiness,
      weather: weatherDesc,
      avgTemp: temp,
      focus,
      notes,
      items,
    },
  });

  return NextResponse.json({ success: true, plan });
}