import { h1 } from 'framer-motion/client';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SecretTableRow = ({ secret, repoId }) => {
  const navigate = useNavigate();
  return (
    
    <tr 
      className="hover:bg-[#2A2A35] hover:shadow-md transition-all duration-200 group cursor-pointer"
      onClick={() => navigate(`/repositories/${repoId}/secrets/${secret.id}`)}
    >
      <td className="py-3 px-4 text-sm">
        <span className="text-white block w-full h-full">
          {secret.name}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">
        <span className="text-white block w-full h-full">
          {secret.location}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="text-white block w-full h-full">
          <div className="flex items-center">
            <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
              secret.severity === 'critical' ? 'bg-red-600' : 
              secret.severity === 'high' ? 'bg-red-500' : 
              secret.severity === 'medium' ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}></div>
            <span className="text-sm capitalize">{secret.severity}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm">
        <span className="text-white block w-full h-full">
          {secret.detectedDate}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">
        <span className="text-white block w-full h-full">
          {secret.name}
        </span>
      </td>
      <td className="py-3 px-4">
        <Link 
          to={`/repositories/${repoId}/secrets/${secret.id}`}
          className="flex items-center gap-2 hover:no-underline"
        >
          <span 
            className="text-[#A9DFD8] text-xs group-hover:text-white group-hover:font-medium transition-all"
          >
            View Details
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-[#A9DFD8] group-hover:text-white group-hover:translate-x-1 transition-all" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </Link>
      </td>
    </tr>
  );
};

export default SecretTableRow;
