"use client";

export default function BodyweightExercises() {
  const exercises = [
    {
      name: "Push-ups",
      category: "Upper Body",
      description: "Chest, triceps, shoulders",
      icon: "💪", // placeholder icon
    },
    {
      name: "Squats",
      category: "Lower Body",
      description: "Quads, glutes, hamstrings",
      icon: "🏋️", 
    },
    {
      name: "Lunges",
      category: "Lower Body",
      description: "Quads, glutes, balance",
      icon: "🦵",
    },
    {
      name: "Plank",
      category: "Core",
      description: "Abs, stability",
      icon: "🧘",
    },
    {
      name: "Burpees",
      category: "Full Body",
      description: "Cardio + strength",
      icon: "🔥",
    },
    {
      name: "Mountain Climbers",
      category: "Core/Cardio",
      description: "Abs, endurance",
      icon: "⛰️",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Bodyweight Exercises
      </h2>
      <ul className="space-y-4">
        {exercises.map((ex, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
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
    </div>
  );
}