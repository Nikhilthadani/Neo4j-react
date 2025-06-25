import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSecurityStore from '../../stores/SecurityStore';

const LogoutButton = ({ className = '', variant = 'default' }) => {
  const navigate = useNavigate();
   const {clearData} = useSecurityStore()
  const handleLogout = () => {
    // Remove authentication tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('security-store');
    clearData();
    localStorage.removeItem('userId');
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-700 ${className}`}
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="-ml-1 mr-2 h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Logout
    </button>
  );
};

export default LogoutButton;
