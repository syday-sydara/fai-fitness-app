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

export default function WeightTracker() {
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/weight?userId=alex123").then((res) => {
      if (res.data.success) setLogs(res.data.data || []);
    });
    axios.get("/api/weather").then((res) => {
      if (res.data.success) {
        setForecast(res.data.data || []);
        const recs = res.data.data.map((day: any) => {
          const temp = parseFloat(day.avgTemp);
          const desc = day.description.toLowerCase();
          let suggestion = "Outdoor run or park workout";
          if (desc.includes("rain") || desc.includes("snow") || temp < 5) {
            suggestion = "Indoor strength or yoga session";
          } else if (temp > 28) {
            suggestion = "Indoor cardio or early-morning workout";
          }
          return { ...day, suggestion };
        });
        setSuggestions(recs);
      }
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
      {/* Weight Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Log today’s weight
        </label>
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
            className={`px-4 py-2 rounded text-white ${
              weight
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Weight Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Progress Chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={logs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(v) => `${v} kg`} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#ff7300" fill="#ffe0b2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast */}
      <div>
        <h3 className="text-lg font-semibold mb-2">5-Day Forecast</h3>
        <ul className="space-y-2">
          {forecast.map((day, i) => (
            <li
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded ${getTempColor(
                parseFloat(day.avgTemp)
              )}`}
            >
              <span>{getWeatherIcon(day.description)}</span>
              <span className="font-medium">{day.date}</span>
              <span>{day.avgTemp}°C — {day.description}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Workout Suggestions</h3>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              <span>{getWeatherIcon(s.description)}</span>
              <span className="font-medium">{s.date}</span>
              <span>{s.suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}