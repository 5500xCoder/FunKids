import React, { useEffect, useState } from "react";

const Careers = () => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [applyFor, setApplyFor] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "", portfolioUrl: "" });

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/jobs`);
        if (!res.ok) {
          throw new Error("Failed to load jobs");
        }
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setStatus({ type: "error", message: "Unable to load opportunities right now." });
      }
    };

    loadJobs();
  }, []);

  const openApply = (job) => {
    setApplyFor(job);
    setForm({ name: "", email: "", message: "", portfolioUrl: "" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!applyFor) return;

    setStatus({ type: "", message: "" });
    try {
      const res = await fetch(`${baseUrl}/api/jobs/${applyFor._id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to apply");
      }
      setStatus({ type: "success", message: "Application submitted successfully." });
      setApplyFor(null);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="page stream-page">
      <section className="page-hero dark">
        <h1>Jobs</h1>
        <p>Join FunKids Studio and help shape the next generation of kids content.</p>
      </section>

      {status.message && <div className={`alert ${status.type}`}>{status.message}</div>}

      <section className="section">
        <div className="section-header">
          <h2>Open Opportunities</h2>
          <p>Apply to roles that match your creative strengths.</p>
        </div>
        <div className="card-grid">
          {jobs.length === 0 && (
            <div className="card dark">
              <h3>Hiring Soon</h3>
              <p>We are getting ready to expand our creative team.</p>
              <span className="badge">Produced by FunKids Studio</span>
            </div>
          )}
          {jobs.map((job) => (
            <div key={job._id} className="card dark">
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
              <span className="badge">{job.status === "closed" ? "Closed" : "Open"}</span>
              <div className="admin-actions">
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => openApply(job)}
                  disabled={job.status === "closed"}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {applyFor && (
        <section className="section">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Apply for {applyFor.title}</h2>
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Portfolio URL (optional)
              <input
                name="portfolioUrl"
                value={form.portfolioUrl}
                onChange={handleChange}
                placeholder="https://"
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>
            <div className="admin-actions">
              <button className="btn primary" type="submit">
                Submit Application
              </button>
              <button className="btn ghost" type="button" onClick={() => setApplyFor(null)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default Careers;
