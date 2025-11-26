"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Workout = {
  id: string;
  exercise: string;
  duration: number;
  intensity: "Low" | "Medium" | "High";
  date: string;
};

export default function LogWorkout() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState<Workout["intensity"]>("Medium");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const submitWorkout = async () => {
    if (!exercise || !duration || parseInt(duration) <= 0) {
      toast.error("Please enter valid exercise and duration");
      return;
    }

    try {
      if (editingId) {
        const res = await axios.put(`/api/workouts/${editingId}`, {
          exercise,
          duration: parseInt(duration),
          intensity,
        });
        if (res.data.success) {
          toast.success("Workout updated ✅");
          setEditingId(null);
        } else {
          toast.error(res.data.error || "Failed to update workout");
        }
      } else {
        const res = await axios.post("/api/workouts", {
          userId: "alex123",
          exercise,
          duration: parseInt(duration),
          intensity,
          date: new Date().toISOString(),
        });
        if (res.data.success) {
          toast.success("Workout logged successfully ✅");
        } else {
          toast.error(res.data.error || "Failed to log workout");
        }
      }
      setExercise("");
      setDuration("");
      setIntensity("Medium");
      fetchWorkouts();
    } catch {
      toast.error("Failed to save workout");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(`/api/workouts/${deleteId}`);
      if (res.data.success) {
        toast.success("Workout deleted 🗑️");
        fetchWorkouts();
      } else {
        toast.error(res.data.error || "Failed to delete workout");
      }
    } catch {
      toast.error("Failed to delete workout");
    } finally {
      setDeleteId(null);
    }
  };

  const startEdit = (w: Workout) => {
    setExercise(w.exercise);
    setDuration(w.duration.toString());
    setIntensity(w.intensity);
    setEditingId(w.id);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {editingId ? "Edit Workout" : "Log Workout"}
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
          onChange={(e) => setIntensity(e.target.value as Workout["intensity"])}
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
          {editingId ? "Update Workout" : "Save Workout"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setExercise("");
              setDuration("");
              setIntensity("Medium");
            }}
            className="w-full bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Workout History */}
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Workout History
      </h3>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        {workouts.map((w) => (
          <li
            key={w.id}
            className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-gray-700"
          >
            <div>
              {new Date(w.date).toLocaleDateString()} — {w.exercise} ({w.duration} min)
              <span className="ml-2 text-sm text-gray-500">{w.intensity}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(w)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteId(w.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Delete
            </h4>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this workout? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}