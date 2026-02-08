import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h3>FunKids Studio</h3>
          <p>Creating world-class kids animation & digital content.</p>
          <p className="badge">Produced by FunKids Studio</p>
        </div>
        <div>
          <h4>Explore</h4>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/ytchannels">YTChannels</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/services">Services</Link>
            <Link to="/store">Store</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/internship">Internship</Link>
          </div>
        </div>
        <div>
          <h4>Contact</h4>
          <p>hello@funkidsstudio.com</p>
          <p>+1 (555) 247-6337</p>
          <div className="socials">
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
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
      </div>
      <div className="footer-bottom">
        <span>© 2026 FunKids Studio. All rights reserved.</span>
        <span>Produced by FunKids Studio</span>
      </div>
    </footer>
  );
};

export default Footer;
