import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus({ type: "success", message: data.message });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="page-hero">
        <h1>Contact</h1>
        <p>Let’s talk about your next kids media project.</p>
      </section>

      <section className="section split">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
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
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
          {status.message && (
            <p className={`form-status ${status.type}`}>{status.message}</p>
          )}
        </form>

        <div className="contact-details">
          <h2>Business Inquiries</h2>
          <p>
            Ready to collaborate? We partner with brands, educators, and platforms to deliver
            delightful kids content.
          </p>
          <div className="details-card">
            <p>Email: gourav@funkidsstudio.com</p>
            <p>Phone: +91 6263188060</p>
            <p>Location: Remote-first, serving global clients.</p>
            {/* <p className="badge">Produced by FunKids Studio</p> */}
          </div>
          <div className="socials">
            <a href="https://www.youtube.com/@SonaMonaRhymes" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
