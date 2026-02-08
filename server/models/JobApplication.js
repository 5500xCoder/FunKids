import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "JobOpportunity", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    portfolioUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
