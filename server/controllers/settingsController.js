import SiteSettings from "../models/SiteSettings.js";

const getOrCreate = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreate();
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { homepageFeaturedChannelId, channelOrder, sections } = req.body;
    const settings = await getOrCreate();
    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      {
        homepageFeaturedChannelId: homepageFeaturedChannelId || "",
        channelOrder: Array.isArray(channelOrder) ? channelOrder : settings.channelOrder,
        sections: { ...settings.sections, ...(sections || {}) }
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
