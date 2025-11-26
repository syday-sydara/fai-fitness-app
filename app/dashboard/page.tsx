"use client";
import WeatherTile from "@/components/WeatherTile";
import ReadinessGauge from "@/components/ReadinessGauge";
import ProgressCharts from "@/components/ProgressCharts";
import WeightTracker from "@/components/WeightTracker";
import LogWorkout from "@/components/LogWorkout";
import TodoList from "@/components/TodoList";

export default function Dashboard() {
  const user = { id: "alex123", name: "Alex" };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your readiness score today:
          </p>
        </div>
        <ReadinessGauge score={7} />
      </header>

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <WeatherTile />
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Today’s Plan
          </h2>
          <ul className="space-y-2">
            {[
              "Warm-up: 5 min walk + mobility",
              "Intervals: 6×1 min jog / 1 min walk",
              "Park circuit: Step-ups, Bench dips, Plank",
              "Cool-down: 5 min walk + stretch",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
              >
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Middle Row */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <ProgressCharts />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Weight Tracker
          </h2>
          <WeightTracker userId={user.id} />
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Log Workout
          </h2>
          <LogWorkout userId={user.id} />
        </div>
      </div>

      {/* Footer Row */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <TodoList />
      </div>
    </div>
  );
}