import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const YTChannels = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [channels, setChannels] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Watch FunKids | FunKids Studio";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Watch FunKids YouTube channels inside FunKids Studio.");
    }
    const loadChannels = async () => {
      try {
        const [res, settingsRes] = await Promise.all([
          fetch(`${baseUrl}/api/ytchannels`),
          fetch(`${baseUrl}/api/settings`)
        ]);
        const data = res.ok ? await res.json() : [];
        const settingsData = settingsRes.ok ? await settingsRes.json() : null;
        setChannels(data);
        setSettings(settingsData);
      } finally {
        setLoading(false);
      }
    };
    loadChannels();
  }, []);

  const orderedChannels = React.useMemo(() => {
    if (!settings?.channelOrder?.length) return channels;
    const orderMap = new Map(settings.channelOrder.map((id, idx) => [id, idx]));
    return [...channels].sort((a, b) => (orderMap.get(a._id) ?? 999) - (orderMap.get(b._id) ?? 999));
  }, [channels, settings]);

  const handleSelect = (event) => {
    const id = event.target.value;
    setSelectedId(id);
    if (id) navigate(`/ytchannels/${id}`);
  };

  return (
    <div className="page yt-dashboard">
      <div className="yt-heading">
        <h1>Watch FunKids</h1>
        <p>Enjoy our shows in a Netflix-style experience</p>
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-header">
          <h2>Channel Dashboard</h2>
          <select value={selectedId} onChange={handleSelect}>
            <option value="">Select a channel</option>
            {orderedChannels.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="channel-grid">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="channel-card skeleton" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="channel-grid">
            {orderedChannels.map((channel) => (
              <button
                key={channel._id}
                type="button"
                className="channel-card"
                onClick={() => navigate(`/ytchannels/${channel._id}`)}
              >
                <div className="channel-thumb">
                  {channel.featuredVideoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${channel.featuredVideoId}/hqdefault.jpg`}
                      alt={channel.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="thumb-placeholder">FunKids</div>
                  )}
                </div>
                <div className="channel-info">
                  <div className="channel-header">
                    {channel.logoUrl ? (
                      <img src={channel.logoUrl} alt={channel.name} className="channel-logo" />
                    ) : (
                      <div className="channel-logo placeholder">FK</div>
                    )}
                    <div>
                      <h3>
                        {channel.name} {channel.isVerified && <span className="verified">✔</span>}
                      </h3>
                      <p className="muted">{channel.category || "FunKids Channel"}</p>
                    </div>
                    <span className="yt-badge">YouTube</span>
                  </div>
                  <div className="channel-stats">
                    <span>{channel.subscriberCount?.toLocaleString() || 0} subscribers</span>
                    <span>{channel.totalVideos || 0} videos</span>
                  </div>
                  {settings?.homepageFeaturedChannelId === channel._id && (
                    <span className="badge">Homepage Featured</span>
                  )}
                  <span className="badge">Produced by FunKids Studio</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default YTChannels;
