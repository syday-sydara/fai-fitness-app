import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Weight from "@/models/Weight";

interface WeightInput {
  userId?: string;
  date: string;
  weight: number;
}

function validateWeightInput(body: WeightInput) {
  if (!body.weight || typeof body.weight !== "number") return "Weight must be a number";
  if (body.weight < 30 || body.weight > 300) return "Weight must be between 30kg and 300kg";
  if (!body.date || isNaN(Date.parse(body.date))) return "Date must be a valid ISO string";
  if (!body.userId) return "User ID is required";
  return null;
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const query = userId ? { userId } : {};
    const weights = await Weight.find(query).sort({ date: 1 });
    return NextResponse.json({ success: true, data: weights, error: null });
  } catch (err) {
    console.error("GET /api/weight error:", err);
    return NextResponse.json({ success: false, data: null, error: "Failed to fetch weights" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body: WeightInput = await req.json();

    const validationError = validateWeightInput(body);
    if (validationError) {
      return NextResponse.json({ success: false, data: null, error: validationError }, { status: 400 });
    }

    const weight = new Weight(body);
    await weight.save();
    return NextResponse.json({ success: true, data: weight, error: null });
  } catch (err) {
    console.error("POST /api/weight error:", err);
    return NextResponse.json({ success: false, data: null, error: "Failed to save weight" }, { status: 500 });
  }
}