"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ForecastDay = {
  date: string;
  avgTemp: number;
  description: string;
};

export default function WeatherTile({
  forecast = [],
  isMock = false,
}: {
  forecast?: ForecastDay[];
  isMock?: boolean;
}) {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          5-Day Forecast (Toronto)
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Loading forecast...</p>
      </div>
    );
  }

  // Add icons based on description
  const getIcon = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes("rain")) return "🌧️";
    if (d.includes("snow")) return "❄️";
    if (d.includes("cloud")) return "☁️";
    return "☀️";
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        5-Day Forecast (Toronto)
      </h2>
      {isMock && (
        <p className="text-yellow-600 dark:text-yellow-400 mb-2">
          ⚠️ Showing mock data (API not connected)
        </p>
      )}

      {/* Forecast list */}
      <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
        {forecast.map((day) => (
          <li key={day.date} className="flex justify-between">
            <span>
              {day.date}: {day.avgTemp}°C
            </span>
            <span>
              {getIcon(day.description)} {day.description}
            </span>
          </li>
        ))}
      </ul>

      {/* Forecast chart */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={forecast.map((d) => ({ ...d, avgTemp: Number(d.avgTemp) }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(v) => `${v}°C`} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="avgTemp"
            stroke="#1e90ff"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}