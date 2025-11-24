import mongoose, { Schema, model, models, Document } from "mongoose";

// Define a TypeScript interface for strong typing
interface WeightDoc extends Document {
  userId: string;
  date: Date;
  weight: number;
}

// Define the schema with validation and constraints
const WeightSchema = new Schema<WeightDoc>(
  {
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    weight: { type: Number, required: true, min: 30, max: 300 },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Add an index for performance and uniqueness
WeightSchema.index({ userId: 1, date: 1 }, { unique: true });

// Export the model safely (avoids recompilation issues in Next.js)
export default models.Weight || model<WeightDoc>("Weight", WeightSchema);