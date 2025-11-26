"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function WeightTracker({ userId }: { userId: string }) {
  const [weight, setWeight] = useState("");
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/weights?userId=${userId}`).then((r) => r.json()).then((d) => {
      if (d.success) setLogs(d.data);
    });
  }, [userId]);

  const saveWeight = async () => {
    try {
      const res = await fetch("/api/weights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, value: parseFloat(weight), date: new Date().toISOString() }),
      });
      const data = await res.json();
      if (data.success) {
        setLogs([data.data, ...logs]);
        setWeight("");
        toast.success("Weight log saved!");
      } else {
        toast.error(data.error || "Failed to save weight");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const deleteWeight = async (id: string) => {
    try {
      const res = await fetch(`/api/weights?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLogs((prev) => prev.filter((l) => l.id !== id));
        toast.success("Weight log removed");
      } else {
        toast.error(data.error || "Failed to delete weight");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight"
          className="border p-2 rounded flex-1"
        />
        <button onClick={saveWeight} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="flex justify-between items-center">
            <span>{new Date(log.date).toLocaleDateString()} — {log.value} kg</span>
            <button onClick={() => deleteWeight(log.id)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}