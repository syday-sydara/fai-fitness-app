"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

interface ProgressEntry {
  date: string;
  weight?: number;
  duration?: number;
  weightAvg?: number;
}

export default function ProgressCharts() {
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const targetWeight = 70;

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/progress?userId=alex123");
      if (res.data.success) {
        const { workouts, weights } = res.data;

        const dateSet = new Set<string>();
        weights.forEach((w: any) => dateSet.add(w.date));
        workouts.forEach((wo: any) => dateSet.add(wo.date));

        const merged: ProgressEntry[] = Array.from(dateSet).map((date) => {
          const weightEntry = weights.find((w: any) => w.date === date);
          const workoutEntry = workouts.find((wo: any) => wo.date === date);
          return {
            date,
            weight: weightEntry?.value,
            duration: workoutEntry?.duration,
          };
        });

        merged.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const windowSize = 7;
        for (let i = 0; i < merged.length; i++) {
          const slice = merged.slice(Math.max(0, i - windowSize + 1), i + 1);
          const weightsOnly = slice.map((d) => d.weight).filter((w) => w !== undefined) as number[];
          if (weightsOnly.length > 0) {
            merged[i].weightAvg = weightsOnly.reduce((sum, w) => sum + w, 0) / weightsOnly.length;
          }
        }

        setProgressData(merged);
        setError(null);
      } else {
        setError(res.data.error || "Failed to load progress data");
      }
    } catch {
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
        <div className="animate-pulse text-center text-gray-500">Loading progress data...</div>
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
            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value, name) => [`${value}`, name]} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 6 }} />
            <Line yAxisId="left" type="monotone" dataKey="weightAvg" stroke="#ff7300" strokeDasharray="5 5" dot={false} name="7-day Avg Weight" />
            <Line yAxisId="right" type="monotone" dataKey="duration" stroke="#82ca9d" strokeWidth={2} dot={false} />
            <ReferenceLine y={targetWeight} yAxisId="left" label="Target Weight" stroke="red" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}