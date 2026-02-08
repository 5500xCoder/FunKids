import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          FunKids Studio
        </Link>
        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/ytchannels" onClick={closeMenu}>
            YTChannels
          </NavLink>
          <NavLink to="/projects" onClick={closeMenu}>
            Projects
          </NavLink>
          <NavLink to="/services" onClick={closeMenu}>
            Services
          </NavLink>
          <NavLink to="/store" onClick={closeMenu}>
            Store
          </NavLink>
          <NavLink to="/jobs" onClick={closeMenu}>
            Jobs
          </NavLink>
        </nav>
        <div className="nav-actions">
          <Link to="/cart" className="nav-cta ghost" onClick={closeMenu}>
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
