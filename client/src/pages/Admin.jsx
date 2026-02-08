import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Admin = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { token, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [form, setForm] = useState({ title: "", description: "", status: "upcoming" });
  const [editingId, setEditingId] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });
  const [resetForm, setResetForm] = useState({ id: "", password: "" });
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({
    jobId: "",
    title: "",
    description: "",
    skillsRequired: "",
    status: "open"
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    isActive: true
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ytChannels, setYtChannels] = useState([]);
  const [ytForm, setYtForm] = useState({
    channelId: "",
    name: "",
    channelUrl: "",
    description: "",
    category: "",
    featuredVideoId: "",
    isActive: true
  });
  const [editingYtId, setEditingYtId] = useState(null);
  const [ytLookupQuery, setYtLookupQuery] = useState("");
  const [ytLookupResults, setYtLookupResults] = useState([]);
  const [videoForm, setVideoForm] = useState({
    title: "",
    videoId: "",
    channelId: "",
    channelName: "",
    channelLogo: "",
    thumbnailUrl: "",
    category: "Rhymes",
    isFeatured: false,
    isTrending: false
  });
  const [videos, setVideos] = useState([]);
  const [analytics, setAnalytics] = useState({ totalPlays: 0, totalWatchTime: 0, items: [] });
  const [settings, setSettings] = useState({
    homepageFeaturedChannelId: "",
    channelOrder: [],
    sections: {}
  });

  const loadData = async () => {
    try {
      const [
        projectsRes,
        messagesRes,
        adminsRes,
        jobsRes,
        appsRes,
        productsRes,
        ordersRes,
        ytRes,
        videosRes,
        analyticsRes,
        settingsRes
      ] = await Promise.all([
        fetch(`${baseUrl}/api/projects`),
        fetch(`${baseUrl}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${baseUrl}/api/admin-users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${baseUrl}/api/jobs`),
        fetch(`${baseUrl}/api/jobs/applications/all`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${baseUrl}/api/products/all`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${baseUrl}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${baseUrl}/api/admin/ytchannels`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${baseUrl}/api/videos`),
        fetch(`${baseUrl}/api/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/settings`)
      ]);

      if (
        !projectsRes.ok ||
        !messagesRes.ok ||
        !adminsRes.ok ||
        !jobsRes.ok ||
        !appsRes.ok ||
        !productsRes.ok ||
        !ordersRes.ok ||
        !ytRes.ok ||
        !videosRes.ok ||
        !analyticsRes.ok ||
        !settingsRes.ok
      ) {
        if (messagesRes.status === 401) {
          logout();
        }
        throw new Error("Failed to load data");
      }

      const [
        projectsData,
        messagesData,
        adminsData,
        jobsData,
        appsData,
        productsData,
        ordersData,
        ytData,
        videosData,
        analyticsData,
        settingsData
      ] =
        await Promise.all([
        projectsRes.json(),
        messagesRes.json(),
        adminsRes.json(),
        jobsRes.json(),
        appsRes.json(),
        productsRes.json(),
        ordersRes.json(),
        ytRes.json(),
        videosRes.json(),
        analyticsRes.json(),
        settingsRes.json()
      ]);

      setProjects(projectsData);
      setMessages(messagesData);
      setAdmins(adminsData);
      setJobs(jobsData);
      setApplications(appsData);
      setProducts(productsData);
      setOrders(ordersData);
      setYtChannels(ytData);
      setVideos(videosData);
      setAnalytics(analyticsData);
      setSettings(settingsData);
    } catch (err) {
      setStatus({ type: "error", message: "Unable to load admin data." });
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (event) => {
    const { name, value } = event.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetChange = (event) => {
    const { name, value } = event.target;
    setResetForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobChange = (event) => {
    const { name, value } = event.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProductForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleYtChange = (event) => {
    const { name, value, type, checked } = event.target;
    setYtForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleYtLookup = async () => {
    if (!ytLookupQuery.trim()) return;
    setStatus({ type: "", message: "" });
    try {
      const res = await fetch(`${baseUrl}/api/admin/ytchannels/lookup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query: ytLookupQuery })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lookup failed");
      }
      setYtLookupResults(data);
      if (data.length === 1) {
        const pick = data[0];
        setYtForm((prev) => ({
          ...prev,
          channelId: pick.channelId,
          name: pick.name,
          channelUrl: pick.channelUrl,
          description: pick.description
        }));
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleYtSelect = (event) => {
    const selectedId = event.target.value;
    const pick = ytLookupResults.find((item) => item.channelId === selectedId);
    if (!pick) return;
    setYtForm((prev) => ({
      ...prev,
      channelId: pick.channelId,
      name: pick.name,
      channelUrl: pick.channelUrl,
      description: pick.description
    }));
  };

  const handleVideoChange = (event) => {
    const { name, value, type, checked } = event.target;
    setVideoForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleVideoChannelSelect = (event) => {
    const channelId = event.target.value;
    const channel = ytChannels.find((item) => item.channelId === channelId);
    setVideoForm((prev) => ({
      ...prev,
      channelId,
      channelName: channel?.name || "",
      channelLogo: channel?.logoUrl || ""
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const isEditing = Boolean(editingId);
      const res = await fetch(`${baseUrl}/api/projects${isEditing ? `/${editingId}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to create project");
      }
      setStatus({
        type: "success",
        message: isEditing ? "Project updated successfully." : "Project added successfully."
      });
      setForm({ title: "", description: "", status: "upcoming" });
      setEditingId(null);
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      status: project.status || "upcoming"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "", status: "upcoming" });
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to delete project");
      }

      setStatus({ type: "success", message: "Project deleted." });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleAdminCreate = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${baseUrl}/api/admin-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(adminForm)
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to create admin");
      }

      setStatus({ type: "success", message: "Admin user created." });
      setAdminForm({ email: "", password: "" });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleAdminReset = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${baseUrl}/api/admin-users/${resetForm.id}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: resetForm.password })
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to reset password");
      }

      setStatus({ type: "success", message: "Password reset." });
      setResetForm({ id: "", password: "" });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleAdminDelete = async (adminId) => {
    if (!window.confirm("Delete this admin? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/admin-users/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to delete admin");
      }

      setStatus({ type: "success", message: "Admin deleted." });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const startJobEdit = (job) => {
    setEditingJobId(job._id);
    setJobForm({
      jobId: job.jobId,
      title: job.title,
      description: job.description,
      skillsRequired: job.skillsRequired?.join(", ") || "",
      status: job.status || "open"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelJobEdit = () => {
    setEditingJobId(null);
    setJobForm({ jobId: "", title: "", description: "", skillsRequired: "", status: "open" });
  };

  const handleJobSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const payload = {
        ...jobForm,
        skillsRequired: jobForm.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      };
      const isEditing = Boolean(editingJobId);
      const res = await fetch(`${baseUrl}/api/jobs${isEditing ? `/${editingJobId}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to save job");
      }
      setStatus({ type: "success", message: isEditing ? "Job updated." : "Job created." });
      setJobForm({ jobId: "", title: "", description: "", skillsRequired: "", status: "open" });
      setEditingJobId(null);
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleJobDelete = async (jobId) => {
    if (!window.confirm("Delete this job? This cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to delete job");
      }
      setStatus({ type: "success", message: "Job deleted." });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const startProductEdit = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl || "",
      category: product.category || "",
      isActive: product.isActive !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelProductEdit = () => {
    setEditingProductId(null);
    setProductForm({
      title: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "",
      isActive: true
    });
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const payload = { ...productForm, price: Number(productForm.price) };
      const isEditing = Boolean(editingProductId);
      const res = await fetch(`${baseUrl}/api/products${isEditing ? `/${editingProductId}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to save product");
      }
      setStatus({ type: "success", message: isEditing ? "Product updated." : "Product created." });
      setProductForm({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
        isActive: true
      });
      setEditingProductId(null);
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to delete product");
      }
      setStatus({ type: "success", message: "Product deleted." });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const startYtEdit = (channel) => {
    setEditingYtId(channel._id);
    setYtForm({
      channelId: channel.channelId,
      name: channel.name,
      channelUrl: channel.channelUrl,
      description: channel.description,
      category: channel.category || "",
      featuredVideoId: channel.featuredVideoId || "",
      isActive: channel.isActive !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelYtEdit = () => {
    setEditingYtId(null);
    setYtForm({ channelId: "", name: "", channelUrl: "", description: "", category: "", featuredVideoId: "", isActive: true });
  };

  const handleYtSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const isEditing = Boolean(editingYtId);
      const payload = {
        channelId: ytForm.channelId,
        category: ytForm.category,
        featuredVideoId: ytForm.featuredVideoId,
        isActive: ytForm.isActive
      };
      const res = await fetch(`${baseUrl}/api/admin/ytchannels${isEditing ? `/${editingYtId}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to save channel");
      }
      setStatus({
        type: "success",
        message: isEditing ? "Channel updated." : "Channel created."
      });
      setYtForm({ channelId: "", name: "", channelUrl: "", description: "", category: "", featuredVideoId: "", isActive: true });
      setEditingYtId(null);
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleYtDelete = async (channelId) => {
    if (!window.confirm("Delete this channel? This cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/api/admin/ytchannels/${channelId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to delete channel");
      }
      setStatus({ type: "success", message: "Channel deleted." });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleYtSync = async (channelId) => {
    try {
      const res = await fetch(`${baseUrl}/api/admin/ytchannels/${channelId}/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Sync failed");
      }
      setStatus({ type: "success", message: "Channel synced." });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleVideoSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${baseUrl}/api/admin/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(videoForm)
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
        }
        throw new Error(data.message || "Failed to add video");
      }
      setStatus({ type: "success", message: "Video added." });
      setVideoForm({
        title: "",
        videoId: "",
        channelId: "",
        channelName: "",
        channelLogo: "",
        thumbnailUrl: "",
        category: "Rhymes",
        isFeatured: false,
        isTrending: false
      });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleVideoDelete = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      const res = await fetch(`${baseUrl}/api/admin/videos/${videoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete video");
      }
      setStatus({ type: "success", message: "Video deleted." });
      loadData();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const updateSettings = async (nextSettings) => {
    try {
      const res = await fetch(`${baseUrl}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nextSettings)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update settings");
      }
      setSettings(data);
      setStatus({ type: "success", message: "Settings updated." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleFeaturedChannelChange = (event) => {
    updateSettings({ ...settings, homepageFeaturedChannelId: event.target.value });
  };

  const handleSectionToggle = (key) => {
    updateSettings({
      ...settings,
      sections: { ...(settings.sections || {}), [key]: !(settings.sections || {})[key] }
    });
  };

  const moveChannel = (index, direction) => {
    const order = settings.channelOrder?.length ? [...settings.channelOrder] : ytChannels.map((c) => c._id);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= order.length) return;
    const [item] = order.splice(index, 1);
    order.splice(newIndex, 0, item);
    updateSettings({ ...settings, channelOrder: order });
  };

  const orderedChannelIds = settings.channelOrder?.length
    ? settings.channelOrder
    : ytChannels.map((channel) => channel._id);
  const orderedChannels = orderedChannelIds
    .map((id) => ytChannels.find((channel) => channel._id === id))
    .filter(Boolean);

  return (
    <div className="page admin-page">
      <section className="admin-hero">
        <div>
          <p className="admin-kicker">FunKids Studio • Admin Console</p>
          <h1>Dashboard</h1>
          <p className="admin-subtitle">
            Manage productions, careers, and studio communications in one place.
          </p>
        </div>
        <button className="btn ghost" type="button" onClick={logout}>
          Log Out
        </button>
      </section>

      <section className="admin-stats">
        <div className="stat-card">
          <h3>Productions</h3>
          <p className="stat-value">{projects.length}</p>
        </div>
        <div className="stat-card">
          <h3>Messages</h3>
          <p className="stat-value">{messages.length}</p>
        </div>
        <div className="stat-card">
          <h3>Jobs</h3>
          <p className="stat-value">{jobs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Applications</h3>
          <p className="stat-value">{applications.length}</p>
        </div>
        <div className="stat-card">
          <h3>Admins</h3>
          <p className="stat-value">{admins.length}</p>
        </div>
        <div className="stat-card">
          <h3>Products</h3>
          <p className="stat-value">{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <p className="stat-value">{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>YT Channels</h3>
          <p className="stat-value">{ytChannels.length}</p>
        </div>
      </section>

      {status.message && <div className={`alert ${status.type}`}>{status.message}</div>}

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>{editingId ? "Edit Production" : "Add Production"}</h2>
            <p>Keep the productions list fresh and accurate.</p>
          </div>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="current">Current</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </label>
            <div className="admin-actions">
              <button className="btn primary" type="submit">
                {editingId ? "Update Production" : "Add Production"}
              </button>
              {editingId && (
                <button className="btn ghost" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <h2>Productions</h2>
            <p>Current slate and upcoming releases.</p>
          </div>
          <div className="list-grid">
            {projects.map((project) => (
              <div key={project._id || project.title} className="list-card">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="list-meta">
                  <span className="badge">{project.status}</span>
                  <div className="admin-actions">
                    <button className="btn ghost" type="button" onClick={() => startEdit(project)}>
                      Edit
                    </button>
                    <button
                      className="btn secondary"
                      type="button"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Contact Messages</h2>
            <p>Latest studio inquiries and partnership requests.</p>
          </div>
          <div className="list-grid">
            {messages.map((msg) => (
              <div key={msg._id} className="list-card">
                <div>
                  <h3>{msg.name}</h3>
                  <p>{msg.email}</p>
                  <p>{msg.message}</p>
                </div>
                <p className="muted">
                  Received: {new Date(msg.createdAt || msg.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Admin Users</h2>
            <p>Control access for the internal team.</p>
          </div>
          <div className="panel-columns">
            <form className="admin-form" onSubmit={handleAdminCreate}>
              <h3>Add Admin</h3>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={adminForm.email}
                  onChange={handleAdminChange}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={adminForm.password}
                  onChange={handleAdminChange}
                  required
                />
              </label>
              <button className="btn primary" type="submit">
                Create Admin
              </button>
            </form>

            <form className="admin-form" onSubmit={handleAdminReset}>
              <h3>Reset Password</h3>
              <label>
                Admin
                <select name="id" value={resetForm.id} onChange={handleResetChange} required>
                  <option value="">Select admin</option>
                  {admins.map((admin) => (
                    <option key={admin._id} value={admin._id}>
                      {admin.email}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                New Password
                <input
                  type="password"
                  name="password"
                  value={resetForm.password}
                  onChange={handleResetChange}
                  required
                />
              </label>
              <button className="btn primary" type="submit">
                Reset Password
              </button>
            </form>
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <h2>Admin Directory</h2>
            <p>Active admin accounts.</p>
          </div>
          <div className="list-grid">
            {admins.map((admin) => (
              <div key={admin._id} className="list-card">
                <div>
                  <h3>{admin.email}</h3>
                  <p>Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="admin-actions">
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() => handleAdminDelete(admin._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Career Opportunities</h2>
            <p>Publish roles and update openings instantly.</p>
          </div>
          <form className="admin-form" onSubmit={handleJobSubmit}>
            <h3>{editingJobId ? "Edit Job" : "Add Job"}</h3>
            <label>
              Job ID
              <input name="jobId" value={jobForm.jobId} onChange={handleJobChange} required />
            </label>
            <label>
              Title
              <input name="title" value={jobForm.title} onChange={handleJobChange} required />
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows="4"
                value={jobForm.description}
                onChange={handleJobChange}
                required
              />
            </label>
            <label>
              Skills Required (comma separated)
              <input
                name="skillsRequired"
                value={jobForm.skillsRequired}
                onChange={handleJobChange}
                placeholder="Animation, Storyboarding, Editing"
              />
            </label>
            <label>
              Status
              <select name="status" value={jobForm.status} onChange={handleJobChange}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <div className="admin-actions">
              <button className="btn primary" type="submit">
                {editingJobId ? "Update Job" : "Add Job"}
              </button>
              {editingJobId && (
                <button className="btn ghost" type="button" onClick={cancelJobEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <h2>Applications</h2>
            <p>Recent applications for open roles.</p>
          </div>
          <div className="list-grid">
            {applications.map((app) => (
              <div key={app._id} className="list-card">
                <div>
                  <h3>{app.name}</h3>
                  <p>{app.email}</p>
                  <p className="muted">
                    Job: {app.job?.title} ({app.job?.jobId})
                  </p>
                  <p>{app.message}</p>
                  {app.portfolioUrl && <p className="muted">Portfolio: {app.portfolioUrl}</p>}
                </div>
                <p className="muted">Applied: {new Date(app.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Active Opportunities</h2>
            <p>Jobs currently visible on the Careers page.</p>
          </div>
          <div className="list-grid">
            {jobs.map((job) => (
              <div key={job._id} className="list-card">
                <div>
                  <h3>{job.title}</h3>
                  <p className="muted">Job ID: {job.jobId}</p>
                  <p>{job.description}</p>
                  {job.skillsRequired?.length > 0 && (
                    <div className="skill-tags">
                      {job.skillsRequired.map((skill) => (
                        <span key={skill} className="tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="list-meta">
                  <span className="badge">{job.status}</span>
                  <div className="admin-actions">
                    <button className="btn ghost" type="button" onClick={() => startJobEdit(job)}>
                      Edit
                    </button>
                    <button
                      className="btn secondary"
                      type="button"
                      onClick={() => handleJobDelete(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>FunKids Store</h2>
            <p>Add, edit, and publish store products.</p>
          </div>
          <form className="admin-form" onSubmit={handleProductSubmit}>
            <h3>{editingProductId ? "Edit Product" : "Add Product"}</h3>
            <label>
              Title
              <input name="title" value={productForm.title} onChange={handleProductChange} required />
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows="3"
                value={productForm.description}
                onChange={handleProductChange}
                required
              />
            </label>
            <label>
              Price (INR)
              <input
                type="number"
                name="price"
                min="0"
                value={productForm.price}
                onChange={handleProductChange}
                required
              />
            </label>
            <label>
              Image URL
              <input name="imageUrl" value={productForm.imageUrl} onChange={handleProductChange} />
            </label>
            <label>
              Category
              <select name="category" value={productForm.category} onChange={handleProductChange}>
                <option value="">Select category</option>
                <option value="Kids Study Materials">Kids Study Materials</option>
                <option value="Kids Toys">Kids Toys</option>
                <option value="Fancy Dress">Fancy Dress</option>
                <option value="Kids Merchandise">Kids Merchandise</option>
              </select>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isActive"
                checked={productForm.isActive}
                onChange={handleProductChange}
              />
              Active (visible in store)
            </label>
            <div className="admin-actions">
              <button className="btn primary" type="submit">
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
              {editingProductId && (
                <button className="btn ghost" type="button" onClick={cancelProductEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <h2>Store Products</h2>
            <p>Products visible in the FunKids Store.</p>
          </div>
          <div className="list-grid">
            {products.map((product) => (
              <div key={product._id} className="list-card">
                <div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <p className="muted">₹{Number(product.price).toFixed(0)}</p>
                  <p className="muted">{product.category}</p>
                </div>
                <div className="list-meta">
                  <span className="badge">{product.isActive ? "Active" : "Hidden"}</span>
                  <div className="admin-actions">
                    <button
                      className="btn ghost"
                      type="button"
                      onClick={() => startProductEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn secondary"
                      type="button"
                      onClick={() => handleProductDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Store Orders</h2>
            <p>Orders submitted from the FunKids Store checkout.</p>
          </div>
          <div className="list-grid">
            {orders.map((order) => (
              <div key={order._id} className="list-card">
                <div>
                  <h3>{order.customer?.name}</h3>
                  <p>{order.customer?.email}</p>
                  <p className="muted">
                    ₹{Number(order.subtotal).toFixed(0)} • {order.items.length} items
                  </p>
                  <p className="muted">
                    {order.customer?.address}, {order.customer?.city}, {order.customer?.state} -{" "}
                    {order.customer?.pincode}
                  </p>
                </div>
                <p className="muted">Placed: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>YouTube Channels</h2>
            <p>Add and manage channel showcases.</p>
          </div>
          <form className="admin-form" onSubmit={handleYtSubmit}>
            <h3>{editingYtId ? "Edit Channel" : "Add Channel"}</h3>
            <label>
              Channel URL / ID / Handle
              <input
                name="channelLookup"
                value={ytLookupQuery}
                onChange={(e) => setYtLookupQuery(e.target.value)}
                placeholder="https://www.youtube.com/@channel or channel ID"
              />
            </label>
            <button className="btn ghost" type="button" onClick={handleYtLookup}>
              Fetch Channel
            </button>
            {ytLookupResults.length > 0 && (
              <label>
                Select Channel
                <select value={ytForm.channelId} onChange={handleYtSelect}>
                  <option value="">Choose a channel</option>
                  {ytLookupResults.map((item) => (
                    <option key={item.channelId} value={item.channelId}>
                      {item.name} • {item.subscriberCount.toLocaleString()} subs
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              Channel Name
              <input name="name" value={ytForm.name} readOnly />
            </label>
            <label>
              Description
              <textarea name="description" rows="3" value={ytForm.description} readOnly />
            </label>
            <label>
              Category
              <select name="category" value={ytForm.category} onChange={handleYtChange}>
                <option value="">Select category</option>
                <option value="Rhymes">Rhymes</option>
                <option value="Stories">Stories</option>
                <option value="Learning">Learning</option>
                <option value="Animation">Animation</option>
                <option value="Series">Series</option>
              </select>
            </label>
            <label>
              Featured Video ID (optional)
              <input
                name="featuredVideoId"
                value={ytForm.featuredVideoId}
                onChange={handleYtChange}
                placeholder="e.g. dQw4w9WgXcQ"
              />
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isActive"
                checked={ytForm.isActive}
                onChange={handleYtChange}
              />
              Active (visible on site)
            </label>
            <div className="admin-actions">
              <button className="btn primary" type="submit" disabled={!ytForm.channelId}>
                {editingYtId ? "Update Channel" : "Add Channel"}
              </button>
              {editingYtId && (
                <button className="btn ghost" type="button" onClick={cancelYtEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <h2>Active Channels</h2>
            <p>Channels currently visible on the website.</p>
          </div>
          <div className="list-grid">
            {ytChannels.map((channel) => (
              <div key={channel._id} className="list-card">
                <div>
                  <h3>
                    {channel.name} {channel.isVerified && <span className="verified">✔</span>}
                  </h3>
                  <p>{channel.description}</p>
                  <p className="muted">{channel.channelUrl}</p>
                  <p className="muted">
                    Subscribers: {channel.subscriberCount?.toLocaleString() || "0"} • Videos: {channel.totalVideos || 0}
                  </p>
                  {channel.category && <p className="muted">Category: {channel.category}</p>}
                </div>
                <div className="list-meta">
                  <span className="badge">{channel.isActive ? "Active" : "Hidden"}</span>
                  <div className="admin-actions">
                    <button className="btn ghost" type="button" onClick={() => handleYtSync(channel._id)}>
                      Sync
                    </button>
                    <button className="btn ghost" type="button" onClick={() => startYtEdit(channel)}>
                      Edit
                    </button>
                    <button className="btn secondary" type="button" onClick={() => handleYtDelete(channel._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Netflix-Style Videos</h2>
            <p>Add videos for the YTChannels Netflix-style page.</p>
          </div>
          <form className="admin-form" onSubmit={handleVideoSubmit}>
            <h3>Add Video</h3>
            <label>
              Title
              <input name="title" value={videoForm.title} onChange={handleVideoChange} required />
            </label>
            <label>
              Video ID
              <input name="videoId" value={videoForm.videoId} onChange={handleVideoChange} required />
            </label>
            <label>
              Channel
              <select value={videoForm.channelId} onChange={handleVideoChannelSelect} required>
                <option value="">Select channel</option>
                {ytChannels.map((channel) => (
                  <option key={channel.channelId} value={channel.channelId}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Channel Name
              <input name="channelName" value={videoForm.channelName} readOnly />
            </label>
            <label>
              Channel Logo URL
              <input name="channelLogo" value={videoForm.channelLogo} onChange={handleVideoChange} />
            </label>
            <label>
              Thumbnail URL (optional)
              <input name="thumbnailUrl" value={videoForm.thumbnailUrl} onChange={handleVideoChange} />
            </label>
            <label>
              Category
              <select name="category" value={videoForm.category} onChange={handleVideoChange}>
                <option value="Rhymes">Rhymes</option>
                <option value="Stories">Stories</option>
                <option value="Learning">Learning</option>
                <option value="Series">Series</option>
                <option value="Episodes">Episodes</option>
                <option value="Animation">Animation</option>
                <option value="Popular">Popular</option>
                <option value="Recent">Recently Added</option>
              </select>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isFeatured"
                checked={videoForm.isFeatured}
                onChange={handleVideoChange}
              />
              Mark as featured
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isTrending"
                checked={videoForm.isTrending}
                onChange={handleVideoChange}
              />
              Mark as trending
            </label>
            <button className="btn primary" type="submit">
              Add Video
            </button>
          </form>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <h2>Video Library</h2>
            <p>Videos currently visible on YTChannels.</p>
          </div>
          <div className="list-grid">
            {videos.map((video) => (
              <div key={video._id} className="list-card">
                <div>
                  <h3>{video.title}</h3>
                  <p className="muted">{video.channelName}</p>
                  <p className="muted">Category: {video.category}</p>
                </div>
                <div className="list-meta">
                  <span className="badge">{video.isFeatured ? "Featured" : "Standard"}</span>
                  {video.isTrending && <span className="badge">Trending</span>}
                  <div className="admin-actions">
                    <button className="btn secondary" type="button" onClick={() => handleVideoDelete(video._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </section>
            <section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Website Control</h2>
            <p>Set homepage featured channel, reorder channels, and toggle sections.</p>
          </div>
          <div className="panel-columns">
            <div className="admin-form">
              <label>
                Homepage Featured Channel
                <select value={settings.homepageFeaturedChannelId} onChange={handleFeaturedChannelChange}>
                  <option value="">Select channel</option>
                  {ytChannels.map((channel) => (
                    <option key={channel._id} value={channel._id}>
                      {channel.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.sections?.continueWatching !== false}
                  onChange={() => handleSectionToggle("continueWatching")}
                />
                Continue Watching
              </div>
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.sections?.latestUploads !== false}
                  onChange={() => handleSectionToggle("latestUploads")}
                />
                Latest Uploads
              </div>
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.sections?.mostPopular !== false}
                  onChange={() => handleSectionToggle("mostPopular")}
                />
                Most Popular
              </div>
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.sections?.categories !== false}
                  onChange={() => handleSectionToggle("categories")}
                />
                Category Rows
              </div>
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.sections?.recommended !== false}
                  onChange={() => handleSectionToggle("recommended")}
                />
                Recommended
              </div>
            </div>
            <div className="admin-form">
              <h3>Channel Order</h3>
              <div className="list-grid">
                {orderedChannels.map((channel, index) => (
                  <div key={channel._id} className="list-card">
                    <div>
                      <h4>{channel.name}</h4>
                      <p className="muted">{channel.category || "Category"}</p>
                    </div>
                    <div className="admin-actions">
                      <button className="btn ghost" type="button" onClick={() => moveChannel(index, -1)}>
                        Up
                      </button>
                      <button className="btn ghost" type="button" onClick={() => moveChannel(index, 1)}>
                        Down
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

<section className="admin-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h2>Analytics</h2>
            <p>Channel views, video plays, and watch time.</p>
          </div>
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Plays</h3>
              <p className="stat-value">{analytics.totalPlays || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Watch Time (hrs)</h3>
              <p className="stat-value">
                {(analytics.totalWatchTime / 3600).toFixed(1)}
              </p>
            </div>
          </div>
          <div className="list-grid">
            {(analytics.items || []).map((item) => (
              <div key={item._id} className="list-card">
                <div>
                  <h3>{item.title}</h3>
                  <p className="muted">{item.channelName}</p>
                  <p className="muted">
                    Watch time: {(item.watchTimeSeconds / 60).toFixed(1)} mins
                  </p>
                </div>
                <div className="list-meta">
                  <span className="badge">{item.plays} plays</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Admin;
