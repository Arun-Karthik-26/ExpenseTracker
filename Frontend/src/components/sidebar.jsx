import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import { FiGrid, FiDollarSign, FiCreditCard, FiShield } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-full p-4">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 mb-10">
        <div className="flex items-center">
          <img
            src="data:image/png;base64,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"
            alt="Logo"
            className="mr-2 rounded-full w-9 h-9"
          />
          <span>PennyTrack</span>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul>
          <li className="mb-6">
            <Link to="/dashboard" className="flex items-center font-semibold">
              <FiGrid className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="mb-6">
            <Link to="/budgets" className="flex items-center">
              <FiDollarSign className="mr-3" />
              Budgets
            </Link>
          </li>
          <li className="mb-6">
            <Link to="/expenses" className="flex items-center">
              <FiCreditCard className="mr-3" />
              Expenses
            </Link>
          </li>
          <li>
            <Link to="/upgrade" className="flex items-center">
              <FiShield className="mr-3" />
              Upgrade
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="absolute bottom-6 left-4 flex items-center space-x-3">
        <div className="bg-green-500 h-10 w-10 rounded-full flex items-center justify-center text-white">
          G
        </div>
        <span>Profile</span>
      </div>
    </div>
  );
};

export default Sidebar;
