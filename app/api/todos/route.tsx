import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json({ success: true, data: todos });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to fetch todos" });
  }
}

// POST new todo
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const todo = await prisma.todo.create({ data: { text: body.text } });
    return NextResponse.json({ success: true, data: todo });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add todo" });
  }
}

// PUT toggle todo
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const todo = await prisma.todo.update({
      where: { id: body.id },
      data: { done: body.done },
    });
    return NextResponse.json({ success: true, data: todo });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update todo" });
  }
}

// DELETE todo
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")!;
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete todo" });
  }
}