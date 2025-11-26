"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import WeatherTile from "@/components/WeatherTile";
import ProgressCharts from "@/components/ProgressCharts";
import LogWorkout from "@/components/LogWorkout";
import WeightTracker from "@/components/WeightTracker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const user = { name: "Alex" };
  const todayPlan = [
    "Warm-up: 5 min walk + mobility",
    "Intervals: 6×1 min jog / 1 min walk",
    "Park circuit: Step-ups, Bench dips, Plank",
    "Cool-down: 5 min walk + stretch",
  ];

  const [readiness, setReadiness] = useState<number | null>(null);
  const [trend, setTrend] = useState<any[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get("/api/progress?userId=alex123");
        if (res.data.success) {
          setReadiness(res.data.data.readinessScore);
          setTrend(res.data.data.trend || []);
        }
      } catch {
        setReadiness(null);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Readiness Score: {readiness !== null ? `${readiness}/10` : "Loading..."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <WeatherTile />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Today’s Plan
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
            {todayPlan.map((exercise, i) => (
              <li key={i}>{exercise}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <ProgressCharts />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <WeightTracker />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <LogWorkout />
        </div>

        {/* Readiness Trend Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Readiness Trend
          </h2>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#1e90ff" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No trend data available</p>
          )}
        </div>
      </div>
    </div>
  );
}