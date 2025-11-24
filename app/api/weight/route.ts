import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
  }

  const weights = await prisma.weight.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ success: true, data: weights });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, value, date } = body;

  if (!userId || !value) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const weight = await prisma.weight.create({
    data: { userId, value, date: new Date(date) },
  });

  return NextResponse.json({ success: true, data: weight });
}