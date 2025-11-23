"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const weightData = [
  { date: "Nov 15", weight: 72 },
  { date: "Nov 18", weight: 71.5 },
  { date: "Nov 21", weight: 71 },
];

export default function WeightTracker() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Weight Tracker
      </h2>
      <LineChart width={500} height={300} data={weightData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#ff7300" />
      </LineChart>
    </div>
  );
}
