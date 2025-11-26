"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type ForecastDay = { date: string; avgTemp: string; description: string };

export default function WeatherTile() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/weather")
      .then((res) => { if (res.data.success) setForecast(res.data.data || []); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading forecast...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Weather</h2>
      <ul className="space-y-2">
        {forecast.map((d) => (
          <li key={d.date} className="flex justify-between">
            <span>{d.date}</span>
            <span>{d.avgTemp}°C — {d.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}