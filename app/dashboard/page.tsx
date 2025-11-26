"use client";
import { useEffect, useState } from "react";
import WeatherTile from "@/components/WeatherTile";
import ProgressCharts from "@/components/ProgressCharts";
import LogWorkout from "@/components/LogWorkout";
import WeightTracker from "@/components/WeightTracker";

export default function Dashboard() {
  const user = { name: "Alex" };
  const [readinessScore, setReadinessScore] = useState<number | null>(null);
  const [todayPlan, setTodayPlan] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/plan?userId=alex123&goal=general`);
      const data = await res.json();
      if (data.success) setTodayPlan(data.data.plan);

      const progressRes = await fetch(`/api/progress?userId=alex123`);
      const progressData = await progressRes.json();
      if (progressData.success) setReadinessScore(progressData.data.readinessScore);
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Readiness Score: {readinessScore ?? "Loading..."}/10
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Weather</h2>
          <WeatherTile />
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Today’s Plan</h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
            {todayPlan.length > 0 ? (
              todayPlan.map((exercise, i) => <li key={i}>{exercise}</li>)
            ) : (
              <li>Loading plan...</li>
            )}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Progress</h2>
          <ProgressCharts />
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Weight Tracker</h2>
          <WeightTracker />
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Log Workout</h2>
          <LogWorkout />
        </section>
      </div>
    </main>
  );
}