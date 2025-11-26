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
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const getWeatherIcon = (desc: string) => {
  const d = desc.toLowerCase();
  if (d.includes("sun") || d.includes("clear")) return "☀️";
  if (d.includes("cloud")) return "☁️";
  if (d.includes("rain")) return "🌧️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("storm") || d.includes("thunder")) return "⛈️";
  return "🌤️";
};

const getTempColor = (temp: number) => {
  if (temp <= 5) return "bg-blue-100 text-blue-800";
  if (temp >= 28) return "bg-red-100 text-red-800";
  return "bg-orange-100 text-orange-800";
};

export default function WeeklyDashboard() {
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [days, setDays] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weightRes = await axios.get("/api/weight?userId=alex123");
        if (weightRes.data.success) setLogs(weightRes.data.data || []);

        const weatherRes = await axios.get("/api/weather?days=7");
        if (weatherRes.data.success) {
          const recs = weatherRes.data.data.map((day: any) => {
            const temp = parseFloat(day.avgTemp);
            const desc = day.description.toLowerCase();
            let suggestion = "Outdoor run or park workout";
            let type = "Outdoor";
            if (desc.includes("rain") || desc.includes("snow") || temp < 5) {
              suggestion = "Indoor strength or yoga session";
              type = "Indoor";
            } else if (temp > 28) {
              suggestion = "Indoor cardio or early-morning workout";
              type = "Indoor";
            }
            return { ...day, suggestion, type };
          });
          setDays(recs);

          const indoorCount = recs.filter((d) => d.type === "Indoor").length;
          const outdoorCount = recs.filter((d) => d.type === "Outdoor").length;
          setSummary([
            { category: "Indoor", count: indoorCount },
            { category: "Outdoor", count: outdoorCount },
          ]);
        }
      } catch {
        setError("Failed to load dashboard data");
      }
    };
    fetchData();
  }, []);

  const saveWeight = async () => {
    try {
      const res = await axios.post("/api/weight", {
        userId: "alex123",
        weight: parseFloat(weight),
        date: new Date().toISOString(),
      });
      if (res.data.success) {
        setLogs([...logs, { date: new Date().toISOString(), weight: parseFloat(weight) }]);
        setWeight("");
        setError(null);
      } else {
        setError(res.data.error || "Failed to save weight");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Weekly Fitness Dashboard
      </h2>

      {/* Weight Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Log today’s weight</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="e.g., 72.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="flex-1 border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            disabled={!weight}
            onClick={saveWeight}
            className={`px-4 py-2 rounded text-white ${
              weight ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Weight Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Weight Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={logs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
            <YAxis tickFormatter={(v) => `${v} kg`} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Planner Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Daily Planner</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {days.map((day) => (
            <div
              key={day.date}
              className={`p-4 rounded-lg shadow flex flex-col gap-2 ${getTempColor(
                parseFloat(day.avgTemp)
              )}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{day.date}</span>
                <span>{getWeatherIcon(day.description)}</span>
              </div>
              <p className="text-sm">
                {day.avgTemp}°C — {day.description}
              </p>
              <p className="font-medium">💡 {day.suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Summary Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Weekly Summary</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={summary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1e90ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}