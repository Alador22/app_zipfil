import React from "react";
import "./style.css";

const HomePage = () => {
  return (
    
    <div className="homepage">
      <div className="overlay">
        <h1 className="title">Welcome To Our Website</h1>
        <p className="description">
          Join our community of chess enthusiasts and improve your skills with our tutorials and resources.
        </p>
        <div className="contact">
          <h2>Contact Us</h2>
          <p>If you have any questions or feedback, please feel free to reach out to us at:</p>
          <ul>
            <li>Email: support@chessapp.com</li>
            <li>Phone: 12345678</li>
            <li>Address: 3800 Bøgata, BØ, Norway</li>
          </ul>
        </div>
        <div className="about-us">
          <h2>About Us</h2>
          <p>We are a group of passionate chess players who want to share our knowledge and enthusiasm with the world.</p>
        </div>
      </div>
      <div className="copyright">
        &copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.
      </div>
    </div>
  );
};

export default HomePage;