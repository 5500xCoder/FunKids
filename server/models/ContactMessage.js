import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, minlength: 10 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);
