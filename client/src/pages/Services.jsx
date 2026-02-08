import React from "react";

const services = [
  {
    title: "Kids Animation Production",
    description: "End-to-end animation tailored for young audiences."
  },
  {
    title: "YouTube Channel Production",
    description: "Launch and scale kids content with optimized production workflows."
  },
  {
    title: "Video Editing & Post Production",
    description: "Polished edits, colorful grading, and playful motion design."
  },
  {
    title: "Script & Story Writing",
    description: "Engaging narratives that blend learning with fun."
  },
  {
    title: "Educational Content Creation",
    description: "Curriculum-friendly storytelling for early learning journeys."
  }
  //,{
  //   title: "Educational Content ",
  //   description: "Curriculum-friendly storytelling for early learning journeys."
  // }
];

const Services = () => {
  return (
    <div className="page">
      <section className="page-hero">
        <h1>Services</h1>
        <p>Creative and production services designed for modern kids media brands.</p>
      </section>

      <section className="section">
        <div className="card-grid">
          {services.map((service) => (
            <div key={service.title} className="card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="badge">Produced by FunKids Studio</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;
