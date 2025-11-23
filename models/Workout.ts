import mongoose, { Schema, model, models } from "mongoose";

const WorkoutSchema = new Schema({
  userId: String,
  date: Date,
  sets: Number,
  reps: Number,
  rpe: Number,
  weight: Number,
});

export default models.Workout || model("Workout", WorkoutSchema);
