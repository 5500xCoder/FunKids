import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    videoId: { type: String, required: true, trim: true },
    channelName: { type: String, required: true, trim: true },
    channelId: { type: String, required: true, trim: true },
    channelLogo: { type: String, trim: true },
    thumbnailUrl: { type: String, trim: true },
    category: { type: String, trim: true },
    durationSeconds: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
