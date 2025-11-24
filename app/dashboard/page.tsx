"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import WeatherTile from "@/components/WeatherTile";
import ProgressCharts from "@/components/ProgressCharts";
import LogWorkout from "@/components/LogWorkout";
import WeightTracker from "@/components/WeightTracker";
import BodyweightExercises from "@/components/BodyweightExercises";

export default function DashboardPage() {
  const user = { name: "Alex" };
  const [forecast, setForecast] = useState<any[]>([]); // always an array
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get("/api/weather");
        if (res.data.success) {
          setForecast(res.data.data || []); // fallback to empty array
          setIsMock(!!res.data.data[0]?.mock);
        }
      } catch {
        setForecast([]); // safe fallback
        setIsMock(true);
      }
    };
    fetchForecast();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Readiness Score: 7/10</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherTile forecast={forecast} isMock={isMock} />

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <ProgressCharts />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <WeightTracker />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
  <BodyweightExercises />
</div>


        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <LogWorkout />
        </div>
      </div>
    </div>
  );
}