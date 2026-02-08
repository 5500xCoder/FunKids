import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="page-hero">
        <h1>Admin Login</h1>
        <p>Secure access for the FunKids Studio admin team.</p>
      </section>

      <section className="section split">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
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
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {status.message && (
            <p className={`form-status ${status.type}`}>{status.message}</p>
          )}
        </form>

        <div className="contact-details">
          <h2>Admin Only</h2>
          <p>
            This area is restricted to authorized team members. If you need access, reach out to the
            studio leadership.
          </p>
          <div className="details-card">
            <p>Questions? Email hello@funkidsstudio.com</p>
            <p className="badge">Produced by FunKids Studio</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
