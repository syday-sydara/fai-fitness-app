import { NextResponse } from "next/server";

let weights: any[] = [];

export async function GET() {
  return NextResponse.json(weights);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newWeight = { ...body, id: Date.now() };
  weights.push(newWeight);
  return NextResponse.json(newWeight);
}
