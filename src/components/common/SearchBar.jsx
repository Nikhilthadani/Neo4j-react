import React from 'react';

const SearchBar = ({ placeholder = "Search Repositories and Projects...", value = "", onChange = () => {} }) => {
  return (
    <div className="relative w-full max-w-full">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full py-2 pl-10 pr-8 bg-[#252529] border border-[#333] rounded-md text-[#FFFFFF] text-sm focus:outline-none focus:ring-1 focus:ring-[#444] focus:border-[#444] "
        />
        
        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChange({ target: { value: '' } })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
            aria-label="Clear search"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

       
      </div>
    </div>
  );
};

export default SearchBar;
