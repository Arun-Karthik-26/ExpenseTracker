import React from "react";
import { Link } from "react-router-dom"; // Don't forget to import Link
import { FaMapMarkerAlt, FaPhoneVolume, FaWhatsapp } from "react-icons/fa"; // Use a valid icon

const Footer = () => {
  return (
    <div>
      <footer className="font-poppins flex flex-col md:flex-row justify-around mt-10 bg-blue-950 md:p-3 text-white md:items-center space-y-5 p-6">
        <div>
          <h1 className="font-bold mb-3">Contact us</h1>
          <div className="flex mb-3 gap-2">
            <FaMapMarkerAlt />
            <h2>Vadipatti, Madurai - 625218</h2>
          </div>
          <div className="flex gap-2">
            <FaPhoneVolume />
            <h2>+91 - 6383290293</h2>
          </div>
        </div>
        <div>
          <h1 className="font-bold mb-3">INFORMATION</h1>
          <ul className="text-gray-400">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/quick-shopping">Quick Shopping</Link>
            </li>
            <li>
              <Link to="/contact">Contact us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h1 className="mb-3">OUR PRODUCTS</h1>
          <ul className="text-gray-400">
            <li>PREMIUM SHOTS</li>
            <li>SHOTS</li>
            <li>PAPER BOMB</li>
            <li>SKY DISPLAY</li>
            <li>PREMIUM SKY DISPLAY</li>
          </ul>
        </div>
        <div>
          <img src="" alt="" className="md:w-56" />
        </div>
      </footer>
      <div className="text-center p-5 bg-gray-900 text-white">
        <h1 className="mb-3 text-lg font-semibold">
          © 2024 All Rights Reserved BAAVA CRACKERS Powered by
        </h1>
        <div className="flex justify-center items-center gap-2 text-sm">
          <h2 className="font-medium">Developed by Ajay</h2>
          <FaWhatsapp className="text-green-500" />
          <span className="font-medium">+91 - 75488 41847</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

