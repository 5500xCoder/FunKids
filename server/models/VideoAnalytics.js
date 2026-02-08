import mongoose from "mongoose";

const videoAnalyticsSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    channelId: { type: String, required: true },
    channelName: { type: String, required: true },
    plays: { type: Number, default: 0 },
    watchTimeSeconds: { type: Number, default: 0 },
    lastPlayedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("VideoAnalytics", videoAnalyticsSchema);
