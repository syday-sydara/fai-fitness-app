"use client";
import { useState } from "react";

export default function BodyweightExercises() {
  const exercises = [
    { name: "Push-ups", category: "Upper Body", description: "Chest, triceps, shoulders", icon: "💪" },
    { name: "Squats", category: "Lower Body", description: "Quads, glutes, hamstrings", icon: "🏋️" },
    { name: "Lunges", category: "Lower Body", description: "Quads, glutes, balance", icon: "🦵" },
    { name: "Plank", category: "Core", description: "Abs, stability", icon: "🧘" },
    { name: "Burpees", category: "Full Body", description: "Cardio + strength", icon: "🔥" },
    { name: "Mountain Climbers", category: "Core/Cardio", description: "Abs, endurance", icon: "⛰️" },
  ];

  const categories = ["All", ...new Set(exercises.map((ex) => ex.category))];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExercises =
    selectedCategory === "All"
      ? exercises
      : exercises.filter((ex) => ex.category === selectedCategory);

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Bodyweight Exercises
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <ul className="space-y-4">
        {filteredExercises.map((ex) => (
          <li
            key={ex.name}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <span className="text-2xl">{ex.icon}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {ex.name}{" "}
                <span className="text-sm text-gray-500">({ex.category})</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">{ex.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}