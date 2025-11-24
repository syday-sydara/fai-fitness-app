"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TodaysPlan() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [plan, setPlan] = useState<any[]>([]);
  const readinessScore = 7; // Example: could be dynamic later

  // Fetch weather forecast
  const fetchForecast = async () => {
    try {
      const res = await axios.get("/api/weather");
      if (res.data.success) {
        setForecast(res.data.data || []);
        generatePlan(res.data.data || []);
      }
    } catch {
      setForecast([]);
      generatePlan([]);
    }
  };

  // Generate plan based on readiness + weather
  const generatePlan = (forecastData: any[]) => {
    const today = forecastData[0];
    const temp = today ? parseFloat(today.avgTemp) : 20;
    const desc = today ? today.description.toLowerCase() : "clear";

    let workout = "Outdoor run + bodyweight circuit";
    if (desc.includes("rain") || desc.includes("snow") || temp < 5) {
      workout = "Indoor strength + yoga session";
    } else if (temp > 28) {
      workout = "Early-morning cardio + core indoors";
    }

    const planItems = [
      { time: "Morning", activity: "Warm-up & mobility drills" },
      { time: "Midday", activity: workout },
      { time: "Evening", activity: "Stretching & recovery" },
    ];

    // Adjust intensity based on readiness score
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
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Readiness Score: {readinessScore}/10
      </p>
      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
        {plan.map((p, i) => (
          <li key={i} className="flex justify-between">
            <span className="font-medium">{p.time}</span>
            <span>{p.activity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}