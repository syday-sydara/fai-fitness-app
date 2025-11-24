"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LogWorkout() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("Medium");

  // Fetch logged workouts
  const fetchWorkouts = async () => {
    try {
      const res = await axios.get("/api/workouts?userId=alex123");
      if (res.data.success) {
        setWorkouts(res.data.data || []);
      }
    } catch {
      toast.error("Failed to fetch workouts");
    }
  };

  // Submit new workout
  const submitWorkout = async () => {
    if (!exercise || !duration) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("/api/workouts", {
        userId: "alex123",
        exercise,
        duration: parseInt(duration),
        intensity,
        date: new Date().toISOString(),
      });

      if (res.data.success) {
        setExercise("");
        setDuration("");
        setIntensity("Medium");
        fetchWorkouts();
        toast.success("Workout logged successfully ✅");
      } else {
        toast.error(res.data.error || "Failed to log workout");
      }
    } catch {
      toast.error("Failed to log workout");
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Log Workout
      </h2>

      {/* Input Form */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Exercise (e.g., Push-ups)"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
        />
        <select
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button
          onClick={submitWorkout}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Workout
        </button>
      </div>

      {/* Workout History */}
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Workout History
      </h3>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        {workouts.map((w, i) => (
          <li key={i} className="flex justify-between">
            <span>
              {new Date(w.date).toLocaleDateString()} — {w.exercise} ({w.duration} min)
            </span>
            <span className="text-sm text-gray-500">{w.intensity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}