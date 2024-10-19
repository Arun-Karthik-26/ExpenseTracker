import React from 'react';
import './navbar.css'; 

const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">PennyTrack</h1>
          <div className="flex">
            <a href='/signin'>
              <button className="btn">DashBoard</button>
            </a>
            <button className="btn1">Get Started</button>
          </div>
        </div>
      </nav>
    );
};

export default Navbar;
