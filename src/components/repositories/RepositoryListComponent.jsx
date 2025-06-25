import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar";
import { REPOSITORY_LIST_DATA } from '../../constants/repositoryListData';

const RepositoryListComponent = ({ title = "Recent Secrets", maxItems = 6, showHeader = true }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    
    // Filter data based on search query
    const filteredData = REPOSITORY_LIST_DATA.filter(item => {
        if (!searchQuery) return true;
        const query = (searchQuery || '').toLowerCase();
        return (
            (item.repository && item.repository.toLowerCase().includes(query)) ||
            (item.severity && item.severity.toLowerCase().includes(query)) ||
            (item.tokenType && item.tokenType.toLowerCase().includes(query))
        );
    }).slice(0, maxItems);

    return (
        <div className='bg-[#1e1e1e] rounded-lg p-4 h-full flex flex-col'>
            {showHeader && (
                <div className="flex flex-col sm:flex-row w-full items-center justify-between mb-4">
                    <h2 className="text-[15px] font-semibold text-[#FFFFFF] font-inter mb-3 sm:mb-0">{title}</h2>
                    <div className="w-full sm:w-1/2">
                        <SearchBar 
                            placeholder="Search secrets..." 
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            )}
            
            <div className="overflow-x-auto flex-grow">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="text-[#A4D8D1] text-[14px] border-b border-gray-600">
                        <tr>
                            <th className="p-2 font-medium whitespace-nowrap">Repository</th>
                            <th className="p-2 font-medium whitespace-nowrap">Severity</th>
                            <th className="p-2 font-medium whitespace-nowrap">Token Type</th>
                            <th className="p-2 font-medium whitespace-nowrap">Preview</th>
                            <th className="p-2 font-medium whitespace-nowrap">Line</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={index} className="border-b border-gray-700 border-opacity-30 hover:bg-[#27272A] transition-colors duration-150 cursor-pointer" 
                                    onClick={() => navigate(`/repositories/repo${index + 1}/secrets/secret${index + 1}`)}>
                                    <td className="p-2 text-[#E7EAF0] text-xs font-medium whitespace-nowrap">{item.repository}</td>
                                    <td className="p-2 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${item.severityColor}`}>
                                            <span className="inline-block w-1 h-1 rounded-full mr-1" style={{
                                                backgroundColor: item.severity === 'Critical' ? '#1D1A42' : 
                                                                item.severity === 'High' ? '#F72585' : 
                                                                item.severity === 'Medium' ? '#FFC300' : 
                                                                '#00D4FF'
                                            }}></span>
                                            {item.severity}
                                        </span>
                                    </td>
                                    <td className="p-2 text-[#D8D8D8] text-xs whitespace-nowrap">{item.tokenType}</td>
                                    <td className="p-2 whitespace-pre-wrap min-w-[150px]">
                                        <div className='text-xs'>const accessKey = "AKIA...XYZW"</div>
                                    </td>
                                    <td className="p-2 text-[#00D4FF] hover:underline cursor-pointer text-xs font-medium whitespace-nowrap">Line 45</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-400">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <p className="text-sm">No matching secrets found</p>
                                        {searchQuery && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }} 
                                                className="mt-2 px-3 py-1 bg-[#2A2A35] text-[#A9DFD8] rounded text-xs hover:bg-[#36363A] transition-colors"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RepositoryListComponent;
