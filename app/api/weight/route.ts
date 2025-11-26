import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const weight = await prisma.weight.create({ data: body });
    return NextResponse.json({ success: true, weight });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to log weight" });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")!;
  const weights = await prisma.weight.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 10,
  });
  return NextResponse.json({ success: true, weights });
}