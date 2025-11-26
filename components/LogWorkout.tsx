"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LogWorkout({ userId }: { userId: string }) {
  const [form, setForm] = useState({ sets: "", reps: "", rpe: "", weight: "" });

  const saveWorkout = async () => {
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sets: parseInt(form.sets),
          reps: parseInt(form.reps),
          rpe: parseInt(form.rpe),
          weight: form.weight ? parseFloat(form.weight) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Workout logged!");
        setForm({ sets: "", reps: "", rpe: "", weight: "" });
      } else {
        toast.error(data.error || "Failed to log workout");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {["sets", "reps", "rpe", "weight"].map((f) => (
        <input
          key={f}
          type="number"
          placeholder={f}
          value={(form as any)[f]}
          onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          className="border p-2 rounded"
        />
      ))}
      <button onClick={saveWorkout} className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
  );
}