import React from "react";

const Internship = () => {
  return (
    <div className="page stream-page">
      <section className="page-hero dark">
        <h1>Internship</h1>
        <p>Kickstart your creative journey with FunKids Studio.</p>
      </section>
      <section className="section">
        <div className="card-grid">
          {[
            "Animation Intern",
            "Video Editing Intern",
            "Story Writing Intern",
            "Social Media Intern"
          ].map((role) => (
            <div key={role} className="card dark">
              <h3>{role}</h3>
              <p>Learn from a streaming-first animation studio and build real-world skills.</p>
              <span className="badge">Applications Opening Soon</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Internship;
