import React from "react";

const About = () => {
  return (
    <div className="page">
      <section className="page-hero">
        <h1>About FunKids Studio</h1>
        <p>
          FunKids Studio is a digital media and animation production company focused on creating
          kids-first content that is vibrant, educational, and globally loved.
        </p>
      </section>

      <section className="section split">
        <div>
          <h2>Founder Story</h2>
          <p>
            FunKids Studio began with a simple idea: build a safe, colorful world where children can
            learn, laugh, and grow. Our founder combined a love for storytelling with a passion for
            animation to create a studio that celebrates curiosity and creativity.
          </p>
        </div>
        <div className="highlight-card">
          <h3>Vision & Mission</h3>
          <p>
            Our mission is to craft world-class kids animation that sparks imagination and supports
            early learning. Our vision is to grow into a global kids animation studio with a joyful
            impact.
          </p>
          <span className="badge">Produced by FunKids Studio</span>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Future Goal</h2>
          <p>To establish FunKids Studio as a global leader in kids animation and digital content.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
