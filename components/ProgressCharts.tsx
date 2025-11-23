"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const sampleData = [
  { date: "Nov 20", reps: 10, weight: 20 },
  { date: "Nov 21", reps: 12, weight: 22 },
  { date: "Nov 22", reps: 14, weight: 24 },
];

export default function ProgressCharts() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Strength Progress
      </h2>
      <LineChart width={500} height={300} data={sampleData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="reps" stroke="#8884d8" />
        <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
