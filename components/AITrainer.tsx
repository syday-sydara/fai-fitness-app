"use client";
import { useEffect, useState } from "react";

interface TrainerResponse {
  message: string;
}

export default function AITrainer({ userId }: { userId: string }) {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAdvice() {
      setLoading(true);
      try {
        const res = await fetch(`/api/trainer?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch advice");
        const data: TrainerResponse = await res.json();
        setAdvice(data.message);
      } catch {
        setAdvice("Sorry, I couldn’t load your advice.");
      } finally {
        setLoading(false);
      }
    }
    fetchAdvice();
  }, [userId]);

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2">AI Trainer</h2>
      {loading ? (
        <p className="animate-pulse">Loading advice...</p>
      ) : (
        <p className="text-lg">{advice}</p>
      )}
    </div>
  );
}