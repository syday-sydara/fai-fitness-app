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
  ReferenceDot,
  Label,
} from "recharts";

// Helper: group by week
function groupByWeek(data: any[], key: string) {
  const weeks: Record<string, number[]> = {};
  data.forEach((item) => {
    const d = new Date(item.date);
    const weekKey = `${d.getFullYear()}-W${Math.ceil(
      (d.getDate() + d.getDay()) / 7
    )}`;
    if (!weeks[weekKey]) weeks[weekKey] = [];
    if (item[key]) weeks[weekKey].push(item[key]);
  });

  return Object.entries(weeks).map(([week, values]) => ({
    week,
    [key]: values.reduce((a, b) => a + b, 0) / values.length,
  }));
}

export default function ProgressCharts() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const targetWeight = 70; // Example goal in kg
  const milestones: any[] = [];

  const fetchProgress = async () => {
    try {
      const res = await axios.get("/api/progress?userId=alex123");
      if (res.data.success) {
        const { workouts, weights } = res.data;

        const weightData = weights.map((w: any) => ({
          date: new Date(w.date).toLocaleDateString(),
          weight: w.value,
        }));

        const workoutData = workouts.map((wo: any) => ({
          date: new Date(wo.date).toLocaleDateString(),
          duration: wo.duration,
        }));

        const weeklyWeights = groupByWeek(weightData, "weight");
        const weeklyWorkouts = groupByWeek(workoutData, "duration");

        const weeklyMerged = weeklyWeights.map((w) => ({
          week: w.week,
          weight: w.weight,
          duration:
            weeklyWorkouts.find((wo) => wo.week === w.week)?.duration || 0,
        }));

        setWeeklyData(weeklyMerged);

        // Example milestone logic
        weeklyMerged.forEach((entry, idx) => {
          if (idx > 0) {
            const prev = weeklyMerged[idx - 1];
            if (prev.weight - entry.weight >= 5) {
              milestones.push({
                week: entry.week,
                weight: entry.weight,
                label: "Lost 5kg 🎉",
              });
            }
            if (entry.duration >= 300) {
              milestones.push({
                week: entry.week,
                duration: entry.duration,
                label: "Hit 5h workouts 💪",
              });
            }
          }
        });
      }
    } catch (err) {
      console.error("Failed to fetch progress", err);
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
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Weekly average weight */}
          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
          {/* Weekly average workout duration */}
          <Line type="monotone" dataKey="duration" stroke="#82ca9d" />
          {/* Goal line */}
          <ReferenceLine
            y={targetWeight}
            label="Target Weight"
            stroke="red"
            strokeDasharray="3 3"
          />
          {/* Milestones */}
          {milestones.map((m, i) => (
            <ReferenceDot
              key={i}
              x={m.week}
              y={m.weight || m.duration}
              r={6}
              fill="gold"
              stroke="black"
            >
              <Label value={m.label} position="top" />
            </ReferenceDot>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}