import React, { useState } from "react";
import "../styles/Heading.css";
import { Link } from "react-router-dom";

const Heading = ({ isLoggedIn, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="navbar">
      <div className="logo">
        <span>
          Co<span className="highlight">nva</span>
        </span>
      </div>
      <div
        className={`hamburger ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

    
      <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/about">About</Link>
        <Link to="/myRooms">Rooms</Link>
        {isLoggedIn ? (
          <div className="username">
            <img
              src="https://via.placeholder.com/30"
              alt="User Avatar"
              className="avatar"
            />
            {userName}
            <Link to="/logout" className="logout-btn">
              Logout
            </Link>
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Heading;
