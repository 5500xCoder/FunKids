import React from "react";

const Projects = () => {
  return (
    <div className="page stream-page">
      <section className="page-hero dark">
        <h1>Projects</h1>
        <p>Explore FunKids Studio productions, collaborations, and upcoming releases.</p>
      </section>
      <section className="section">
        <div className="card-grid">
          {[
            "Sona Mona Rhymes",
            "FunKids Stories",
            "FunKids Learning",
            "Animation Series"
          ].map((project) => (
            <div key={project} className="card dark">
              <h3>{project}</h3>
              <p>Streaming-ready content crafted for curious young minds.</p>
              <span className="badge">Produced by FunKids Studio</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
