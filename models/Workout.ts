import mongoose, { Schema, model, models, Document } from "mongoose";

// Define a TypeScript interface for strong typing
interface WorkoutDoc extends Document {
  userId: string;
  date: Date;
  sets: number;
  reps: number;
  rpe: number;
  weight?: number; // optional
}

// Define the schema with validation and constraints
const WorkoutSchema = new Schema<WorkoutDoc>(
  {
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    sets: { type: Number, required: true, min: 1, max: 20 },
    reps: { type: Number, required: true, min: 1, max: 50 },
    rpe: { type: Number, required: true, min: 1, max: 10 },
    weight: { type: Number, min: 0 }, // optional but constrained
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Add an index for performance and uniqueness
WorkoutSchema.index({ userId: 1, date: 1 }, { unique: true });

// Export the model safely (avoids recompilation issues in Next.js)
export default models.Workout || model<WorkoutDoc>("Workout", WorkoutSchema);