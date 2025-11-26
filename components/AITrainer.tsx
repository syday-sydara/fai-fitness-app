"use client";
import { useEffect, useState } from "react";

export default function AITrainer({ userId }: { userId: string }) {
  const [advice, setAdvice] = useState<string>("Loading...");

  useEffect(() => {
    async function fetchAdvice() {
      const res = await fetch(`/api/trainer?userId=${userId}`);
      const data = await res.json();
      setAdvice(data.message);
    }
    fetchAdvice();
  }, [userId]);

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2">AI Trainer</h2>
      <p className="text-lg">{advice}</p>
    </div>
  );
}