import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["current", "upcoming"],
      default: "upcoming"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
