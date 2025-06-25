import React, { useState, useRef, useEffect } from "react";
import LogoutButton from "../Auth/LogoutButton";

const Navbar = ({ toggleMobileMenu, visible = true }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <nav
      className={`absolute top-0 h-[60px] bg-[#19191C] rounded-lg flex items-center hover:block z-40 w-[90%] px-4 justify-between m-2 transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Mobile Hamburger */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Right Side Content */}
      <div className="flex items-center gap-3 lg:gap-5 ml-auto">
        {/* Search Box */}
        <div className="relative max-w-[250px] hidden sm:block">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <img src="/search.svg" alt="Search" width={16} height={16} />
          </div>
          <input
            type="text"
            placeholder="Search here..."
            className="bg-[#2a2a2a] w-full h-[35px] pl-[36px] pr-3 rounded-[8px] text-sm text-[#CCCCCC] placeholder-[#AAAAAA] focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>

        {/* Notification Icon */}
        <div className="relative bg-[#FFFAF1] p-2 rounded-md w-[32px] h-[32px] flex items-center justify-center cursor-pointer">
          <img src="/bellcon.svg" alt="Bell" width={16} height={16} />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-[6px] h-[6px]" />
        </div>

        {/* Profile + Logout */}
        <div className="flex items-center gap-2" ref={profileRef}>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600">
            <img
              src="/profile image.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative">
            <button
              onClick={toggleProfile}
              className="text-[#CCCCCC] text-sm flex items-center"
            >
              <svg
                className={`ml-2 w-4 h-4 transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-10 w-44 bg-[#2a2a2a] rounded-md shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">
                  Settings
                </div>
                <div className="border-t border-gray-700 my-1"></div>
                <div className="px-4 py-2">
                  <LogoutButton className="w-full justify-center" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
