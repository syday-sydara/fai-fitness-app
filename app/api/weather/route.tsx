import { NextResponse } from "next/server";

const CITY = "Toronto"; // still hardcoded for now
const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Missing API key" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Weather API request failed" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Simplify forecast (group by day, average temps)
    const dailyForecast: Record<string, { temps: number[]; descriptions: string[] }> = {};
    data.list.forEach((entry: any) => {
      const date = new Date(entry.dt_txt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dailyForecast[date]) {
        dailyForecast[date] = { temps: [], descriptions: [] };
      }
      dailyForecast[date].temps.push(entry.main.temp);
      dailyForecast[date].descriptions.push(entry.weather[0].description);
    });

    const forecast = Object.entries(dailyForecast).map(([date, info]) => ({
      date,
      avgTemp: (info.temps.reduce((a, b) => a + b, 0) / info.temps.length).toFixed(1),
      description: info.descriptions[0],
    }));

    return NextResponse.json({ success: true, data: forecast });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}