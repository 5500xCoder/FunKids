import mongoose from "mongoose";

const jobOpportunitySchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    skillsRequired: { type: [String], default: [] },
    status: { type: String, enum: ["open", "closed"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("JobOpportunity", jobOpportunitySchema);
