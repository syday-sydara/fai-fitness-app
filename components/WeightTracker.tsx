"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function WeightTracker() {
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    const res = await axios.get("/api/weight");
    setLogs(res.data);
  };

  const submitWeight = async () => {
    await axios.post("/api/weight", {
      weight: parseFloat(weight),
      date: new Date().toISOString(),
    });
    setWeight("");
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Weight Tracker
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Enter weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          onClick={submitWeight}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>

      <LineChart width={500} height={300} data={logs}>
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
