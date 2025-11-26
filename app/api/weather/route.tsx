import { NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ success: false, error: "Missing API key" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "Toronto";

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Weather API failed: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    const daily: Record<string, { temps: number[]; descriptions: string[] }> = {};
    data.list.forEach((entry: any) => {
      const key = new Date(entry.dt_txt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      daily[key] ??= { temps: [], descriptions: [] };
      daily[key].temps.push(entry.main.temp);
      daily[key].descriptions.push(entry.weather[0].description);
    });

    const forecast = Object.entries(daily).slice(0, 5).map(([date, info]) => {
      const avgTemp = (info.temps.reduce((a, b) => a + b, 0) / info.temps.length).toFixed(1);

      // frequency map for descriptions
      const counts: Record<string, number> = {};
      info.descriptions.forEach((d) => (counts[d] = (counts[d] || 0) + 1));
      const description = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

      return { date, avgTemp, description };
    });

    return NextResponse.json({ success: true, data: forecast });
  } catch (err) {
    console.error("Weather error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}