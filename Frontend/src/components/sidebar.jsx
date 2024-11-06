import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate from React Router
import { FiGrid, FiDollarSign, FiCreditCard, FiShield, FiLogOut, FiBell, FiMenu } from "react-icons/fi"; // Import icons
import { getAuth } from "firebase/auth"; // Import Firebase auth methods

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to handle mobile menu
  const navigate = useNavigate(); // Initialize useNavigate
  const auth = getAuth(); // Get Firebase authentication instance

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.error("Error signing out: ", error); // Handle any errors
    }
  };

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white shadow-lg h-full p-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 mb-10">
          <div className="flex items-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoSbpWz8SUrRq7EZL-tE73XEN-oSUPFgA3KQ&s"
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
            <li className="mb-6">
              <Link to="/generate" className="flex items-center">
                <FiShield className="mr-3" />
                Download Report
              </Link>
            </li>
            <li>
              <Link to="/remainders" className="flex items-center">
                <FiBell className="mr-3" />
                Reminders
              </Link>
            </li>
          </ul>
        </nav>

        {/* Profile Section */}
        <div className="absolute bottom-24 left-4 flex items-center space-x-3">
          <div className="bg-green-500 h-10 w-10 rounded-full flex items-center justify-center text-white">
            G
          </div>
          <span>Profile</span>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="absolute bottom-6 left-4 flex items-center text-red-500 hover:text-red-700"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} fixed inset-0 bg-gray-800 bg-opacity-50 p-4`}>
        <div className="bg-white p-4 rounded-md w-64">
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
              <li className="mb-6">
                <Link to="/generate" className="flex items-center">
                  <FiShield className="mr-3" />
                  Download Report
                </Link>
              </li>
              <li>
                <Link to="/remainders" className="flex items-center">
                  <FiBell className="mr-3" />
                  Reminders
                </Link>
              </li>
            </ul>
          </nav>

          {/* Profile Section for Mobile */}
          <div className="flex items-center space-x-3 mt-8">
            <div className="bg-green-500 h-10 w-10 rounded-full flex items-center justify-center text-white">
              G
            </div>
            <span>Profile</span>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="mt-4 flex items-center text-red-500 hover:text-red-700"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Hamburger Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="text-blue-600 p-3 rounded-md bg-white shadow-md"
        >
          <FiMenu className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
