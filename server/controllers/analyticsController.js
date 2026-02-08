import VideoAnalytics from "../models/VideoAnalytics.js";

export const trackVideo = async (req, res, next) => {
  try {
    const { videoId, title, channelId, channelName, watchTimeSeconds, incrementPlay } = req.body;
    if (!videoId || !title || !channelId || !channelName) {
      return res.status(400).json({ message: "Missing analytics fields" });
    }

    const update = {
      $set: { title, channelId, channelName, lastPlayedAt: new Date() },
      $inc: {
        plays: incrementPlay === false ? 0 : 1,
        watchTimeSeconds: Number(watchTimeSeconds || 0)
      }
    };

    await VideoAnalytics.findOneAndUpdate({ videoId }, update, { upsert: true });
    res.json({ message: "Tracked" });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const items = await VideoAnalytics.find().sort({ plays: -1 }).limit(50);
    const totalPlays = items.reduce((sum, item) => sum + (item.plays || 0), 0);
    const totalWatchTime = items.reduce((sum, item) => sum + (item.watchTimeSeconds || 0), 0);
    res.json({ totalPlays, totalWatchTime, items });
  } catch (err) {
    next(err);
  }
};
