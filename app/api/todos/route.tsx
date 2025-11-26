import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

let todos: { id: string; text: string; done: boolean }[] = [];

export async function GET() {
  return NextResponse.json({ success: true, data: todos });
}

export async function POST(req: Request) {
  const { text } = await req.json();
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ success: false, error: "Invalid todo text" }, { status: 400 });
  }
  const todo = { id: randomUUID(), text: text.trim(), done: false };
  todos.push(todo);
  return NextResponse.json({ success: true, data: todo }, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, done, text } = await req.json();
  const t = todos.find((t) => t.id === id);
  if (!t) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  if (typeof done === "boolean") t.done = done;
  if (typeof text === "string" && text.trim()) t.text = text.trim();

  return NextResponse.json({ success: true, data: t });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

  const exists = todos.some((t) => t.id === id);
  if (!exists) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  todos = todos.filter((t) => t.id !== id);
  return NextResponse.json({ success: true, data: { id } });
}