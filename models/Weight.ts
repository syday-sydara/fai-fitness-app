import mongoose, { Schema, model, models } from "mongoose";

const WeightSchema = new Schema({
  userId: String,
  date: Date,
  weight: Number,
});

export default models.Weight || model("Weight", WeightSchema);
