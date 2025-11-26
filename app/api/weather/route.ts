import { NextResponse } from "next/server";

// Mock weather for simplicity. Replace with real provider if desired.
export async function GET() {
  // Example: Today + avg temp
  const data = [
    { description: "Partly cloudy", avgTemp: "21" }
  ];
  return NextResponse.json({ success: true, data });
}