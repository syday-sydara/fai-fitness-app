"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function ProgressCharts() {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const targetWeight = 70; // Example goal

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/progress?userId=alex123");
      if (res.data.success) {
        const { workouts, weights } = res.data;

        const merged: any[] = [];

        weights.forEach((w: any) => {
          merged.push({
            date: new Date(w.date).toLocaleDateString(),
            weight: w.value,
          });
        });

        workouts.forEach((wo: any) => {
          merged.push({
            date: new Date(wo.date).toLocaleDateString(),
            duration: wo.duration,
          });
        });

        merged.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setProgressData(merged);
        setError(null);
      } else {
        setError(res.data.error || "Failed to load progress data");
      }
    } catch (err: any) {
      console.error("Failed to fetch progress", err);
      setError("Unable to load progress data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Progress Charts
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading progress data...</div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={fetchProgress}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : progressData.length === 0 ? (
        <div className="text-gray-500 text-center">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="duration" stroke="#82ca9d" />
            <ReferenceLine
              y={targetWeight}
              label="Target Weight"
              stroke="red"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}