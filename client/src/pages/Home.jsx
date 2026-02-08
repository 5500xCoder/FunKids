import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <span className="pill">Produced by FunKids Studio</span>
          <h1>FunKids Studio</h1>
          <p className="tagline">Creating World-Class Kids Animation & Digital Content</p>
          <p className="intro">
            We are a creative digital media and animation studio crafting joyful, educational,
            and story-driven content for kids around the world.
          </p>
          <div className="hero-actions">
            <Link to="/store" className="btn primary">
              Explore Store
            </Link>
            <Link to="/ytchannels" className="btn ghost">
              Our Channels
            </Link>
            <Link to="/contact" className="btn secondary">
              Work With Us
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-graphic">
            <div className="bubble" />
            <div className="bubble" />
            <div className="bubble" />
          </div>
          <div className="hero-card-content">
            <h3>Featured Production</h3>
            <p className="featured-title">Sona Mona Rhymes</p>
            <p>
              A vibrant kids YouTube channel bringing sing-along rhymes and lovable characters to
              life.
            </p>
            <span className="badge">Produced by FunKids Studio</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Full-service production for modern kids entertainment.</p>
        </div>
        <div className="card-grid">
          {[
            "Animation",
            "Video Production",
            "Script Writing",
            "Kids Content"
          ].map((service) => (
            <div key={service} className="card">
              <h3>{service}</h3>
              <p>
                Imaginative, polished, and crafted to keep young audiences engaged and inspired.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>FunKids Store</h2>
          <p>Explore playful products designed for learning and fun.</p>
        </div>
        <div className="card-grid">
          {["Rhymes Flashcards", "Storybooks Pack", "Character Stickers", "Learning Posters"].map(
            (item) => (
              <div key={item} className="card">
                <h3>{item}</h3>
                <p>Available in the FunKids Store with new drops every month.</p>
                <span className="badge">In Store</span>
              </div>
            )
          )}
        </div>
      </section>

      <section className="vision">
        <div>
          <h2>Our Vision</h2>
          <p>
            To become a global kids animation studio known for joyful storytelling, high-quality
            production, and positive impact on young minds.
          </p>
        </div>
        <div className="vision-card">
          <h3>Studio Promise</h3>
          <ul>
            <li>Kid-safe, family-friendly production standards</li>
            <li>Playful design with professional polish</li>
            <li>Flexible creative collaboration</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
