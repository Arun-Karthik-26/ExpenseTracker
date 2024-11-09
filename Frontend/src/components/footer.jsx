import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneVolume, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <footer className="font-poppins flex flex-col md:flex-row justify-around mt-10 bg-blue-950 md:p-3 text-white md:items-center space-y-5 p-6">
      <div>
  <h1 className="font-bold mb-3 text-xl sm:text-2xl">Contact Us</h1>
  <div className="flex flex-col sm:flex-row sm:items-center mb-3 gap-2 justify-start sm:justify-start">
    <FaMapMarkerAlt className="text-lg sm:text-xl" />
    <h2 className="text-sm sm:text-base">Erode, Er-638060</h2>
  </div>
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-start sm:justify-start">
    <FaPhoneVolume className="text-lg sm:text-xl" />
    <h2 className="text-sm sm:text-base">+91 9876543210</h2>
  </div>
</div>


        <div>
          <h1 className="font-bold mb-3">Quick Links</h1>
          <ul className="text-gray-400">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/get-started">Get Started</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h1 className="font-bold mb-3">Resources</h1>
          <ul className="text-gray-400">
            <li>Expense Management Tips</li>
            <li>Budget Planning Guide</li>
            <li>Financial Wellness Blog</li>
            <li>FAQs</li>
          </ul>
        </div>
      </footer>
      <div className="text-center p-5 bg-gray-900 text-white">
        <h1 className="mb-3 text-lg font-semibold">
          © 2024 PennyTrack. All Rights Reserved.
        </h1>
        {/* Updated layout for mobile responsiveness */}
        <div className="flex justify-center items-center gap-2 text-sm sm:flex-col sm:gap-1">
          <h2 className="font-medium">Developed by Our Team Code Crackers</h2>
          <div className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500" />
            <span className="font-medium">+91 9098789009</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
