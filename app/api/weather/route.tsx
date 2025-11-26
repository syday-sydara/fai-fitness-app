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
      return NextResponse.json({ success: false, error: "Weather API failed" }, { status: res.status });
    }
    const data = await res.json();

    const daily: Record<string, { temps: number[]; descriptions: string[] }> = {};
    data.list.forEach((entry: any) => {
      const key = new Date(entry.dt_txt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      daily[key] ??= { temps: [], descriptions: [] };
      daily[key].temps.push(entry.main.temp);
      daily[key].descriptions.push(entry.weather[0].description);
    });

    const forecast = Object.entries(daily).map(([date, info]) => {
      const avgTemp = (info.temps.reduce((a, b) => a + b, 0) / info.temps.length).toFixed(1);
      const description =
        info.descriptions.sort(
          (a, b) => info.descriptions.filter((v) => v === a).length - info.descriptions.filter((v) => v === b).length
        ).pop() || info.descriptions[0];
      return { date, avgTemp, description };
    });

    return NextResponse.json({ success: true, data: forecast });
  } catch (err) {
    console.error("Weather error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}