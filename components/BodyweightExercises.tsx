"use client";
import { useState } from "react";

interface Exercise {
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  icon: string;
}

export default function BodyweightExercises() {
  const exercises: Exercise[] = [
    { name: "Push-ups", category: "Upper Body", difficulty: "Beginner", description: "Chest, triceps, shoulders", icon: "💪" },
    { name: "Squats", category: "Lower Body", difficulty: "Beginner", description: "Quads, glutes, hamstrings", icon: "🏋️" },
    { name: "Lunges", category: "Lower Body", difficulty: "Intermediate", description: "Quads, glutes, balance", icon: "🦵" },
    { name: "Plank", category: "Core", difficulty: "Beginner", description: "Abs, stability", icon: "🧘" },
    { name: "Burpees", category: "Full Body", difficulty: "Advanced", description: "Cardio + strength", icon: "🔥" },
    { name: "Mountain Climbers", category: "Core/Cardio", difficulty: "Intermediate", description: "Abs, endurance", icon: "⛰️" },
  ];

  // const categories = ["All", ...new Set(exercises.map((ex) => ex.category))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredExercises = exercises.filter((ex) => {
    const categoryMatch = selectedCategory === "All" || ex.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "All" || ex.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

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
              ${selectedCategory === cat ? "bg-blue-600 text-white shadow" : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {difficulties.map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${selectedDifficulty === diff ? "bg-green-600 text-white shadow" : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"}`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredExercises.map((ex) => (
          <li
            key={ex.name}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-transform duration-200 hover:scale-105"
          >
            <span className="text-2xl">{ex.icon}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {ex.name}{" "}
                <span className="text-sm text-gray-500">({ex.category}, {ex.difficulty})</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">{ex.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}