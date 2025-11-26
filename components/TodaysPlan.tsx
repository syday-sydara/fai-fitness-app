"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type Forecast = {
  avgTemp: string;
  description: string;
};

type PlanItem = {
  time: string;
  activity: string;
};

export default function TodaysPlan() {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const readinessScore = 7; // Example: could be dynamic later

  const fetchForecast = async () => {
    try {
      const res = await axios.get("/api/weather");
      if (res.data.success && res.data.data.length > 0) {
        const today = res.data.data[0];
        setForecast(today);
        generatePlan(today);
      } else {
        generatePlan(null);
      }
    } catch {
      generatePlan(null);
    }
  };

  const generatePlan = (today: Forecast | null) => {
    const temp = today ? parseFloat(today.avgTemp) : 20;
    const desc = today ? today.description.toLowerCase() : "clear";

    let workout = "Outdoor run + bodyweight circuit";
    if (desc.includes("rain") || desc.includes("snow") || temp < 5) {
      workout = "Indoor strength + yoga session";
    } else if (temp > 28) {
      workout = "Early-morning cardio + core indoors";
    }

    const planItems: PlanItem[] = [
      { time: "Morning", activity: "Warm-up & mobility drills" },
      { time: "Midday", activity: workout },
      { time: "Evening", activity: "Stretching & recovery" },
    ];

    if (readinessScore < 5) {
      planItems[1].activity = "Light yoga or walk (active recovery)";
    }

    setPlan(planItems);
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Today’s Plan
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Readiness Score: {readinessScore}/10
      </p>
      {forecast && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Weather: {forecast.description} ({forecast.avgTemp}°C)
        </p>
      )}
      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
        {plan.map((p) => (
          <li key={p.time} className="flex justify-between">
            <span className="font-medium">{p.time}</span>
            <span>{p.activity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}