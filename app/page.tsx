"use client";
import WeatherTile from "@/components/WeatherTile";
import ProgressCharts from "@/components/ProgressCharts";
import LogWorkout from "@/components/LogWorkout";
import WeightTracker from "@/components/WeightTracker";

export default function Dashboard() {
  const user = { name: "Alex" };
  const todayPlan = [
    "Warm-up: 5 min walk + mobility",
    "Intervals: 6×1 min jog / 1 min walk",
    "Park circuit: Step-ups, Bench dips, Plank",
    "Cool-down: 5 min walk + stretch"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Readiness Score: 7/10</p>
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
      </div>
    </div>
  );
}
