"use client";
import { useState } from "react";

type PlanItem = { time: string; title: string; details: string; duration: number; intensity: string };
type Plan = {
  id: string;
  focus: string;
  notes?: string;
  weather: string;
  avgTemp: number;
  readiness: number;
  items: PlanItem[];
};

export default function AITrainer({ userId }: { userId: string }) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const weatherRes = await fetch("/api/weather");
      const weatherJson = await weatherRes.json();
      const forecast = weatherJson?.data?.[0]
        ? {
            description: weatherJson.data[0].description,
            avgTemp: parseFloat(weatherJson.data[0].avgTemp),
          }
        : null;

      const readinessRes = await fetch(`/api/readiness?userId=${userId}`);
      const readinessJson = await readinessRes.json();
      const readiness = readinessJson?.score ?? 6;

      const res = await fetch("/api/ai-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          forecast,
          readiness,
          goal: readiness >= 7 ? "strength" : undefined,
        }),
      });
      const json = await res.json();
      if (json.success) setPlan(json.plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">AI Trainer</h2>
      <p className="text-gray-600 mb-4">
        I’ll factor in your weather and readiness, then coach you through the day.
      </p>
      <button
        onClick={generate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate today’s workout"}
      </button>

      {plan && (
        <div className="mt-6">
          <p className="text-gray-700 mb-2">
            Focus: <span className="font-medium">{plan.focus}</span> • Readiness: {plan.readiness}/10 • Weather: {plan.weather} ({plan.avgTemp}°C)
          </p>
          {plan.notes && <p className="text-gray-600 mb-4">{plan.notes}</p>}
          <ul className="space-y-3 text-gray-700">
            {plan.items.map((b) => (
              <li key={`${plan.id}-${b.time}`} className="flex justify-between">
                <span className="font-medium">{b.time}</span>
                <span>
                  {b.title} — {b.details} ({b.duration} min, {b.intensity})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}