import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
export async function POST(req: Request) {
  try {
    const { userId, value, date } = await req.json();
    if (!userId || typeof value !== "number") {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    if (value < 30 || value > 300) {
      return NextResponse.json({ success: false, error: "Invalid weight value" }, { status: 400 });
    }
    const weight = await prisma.weight.create({
      data: { userId, value, date: date ? new Date(date) : new Date() },
    });
    return NextResponse.json({ success: true, data: weight }, { status: 201 });
  } catch (err) {
    console.error("Weight POST error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    const weights = await prisma.weight.findMany({ where: { userId }, orderBy: { date: "desc" } });
    return NextResponse.json({ success: true, data: weights });
  } catch (err) {
    console.error("Weight GET error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    await prisma.weight.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Weight DELETE error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}