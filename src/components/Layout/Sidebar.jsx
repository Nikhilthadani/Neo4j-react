import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { NAV_ITEMS } from "../../constants/navigation";

const Sidebar = ({
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSidebarItem, setActiveSidebarItem] = useState("/dashboard");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isNavbarClick = location.state?.navbarClick;

  useEffect(() => {
    if (!isNavbarClick) {
      setActiveSidebarItem(location.pathname);
    }
  }, [location.pathname, isNavbarClick]);

  const isActive = (path) => activeSidebarItem === path;

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="flex flex-grow inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 ${
          isCollapsed ? "w-[120px]" : "w-[230px]"
        } bg-gradient-to-b from-[#1a1a1d] to-[#16161a] text-white transition-all duration-300 ease-out transform z-50 shadow-2xl border-r border-gray-800/50 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-[80px] px-6 border-b border-gray-800/30">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="/stackguard.png"
                alt="StackGuard Logo"
                className="w-15 h-18 rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-blue-500/20 to-purple-500/20" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-white tracking-tight">
                StackGuard
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-80px)] pt-6">
          {!isCollapsed && (
            <div className="px-6 mb-6">
              <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-800/30">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                  />
                </svg>
                <span className="font-semibold text-gray-400 text-sm tracking-wide uppercase">
                  Home
                </span>
              </div>
            </div>
          )}
          <nav className="flex-1 px-3 lg:px-6">
            <ul className="space-y-2">
              {NAV_ITEMS.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setActiveSidebarItem(item.path);
                      navigate(item.path, { state: { sidebarClick: true } });
                    }}
                    className={`w-full p-3 flex items-center ${
                      isCollapsed ? "justify-center" : "space-x-4"
                    } rounded-xl group relative overflow-hidden transition-all duration-200 ease-out ${
                      isActive(item.path)
                        ? "bg-slate-500 text-white shadow-lg shadow-slate-500/25 scale-[1.02]"
                        : "hover:bg-gray-800/50 hover:text-white text-gray-300"
                    }`}
                  >
                    <div
                      className={`
                        flex items-center justify-center rounded-lg
                        ${isCollapsed ? "w-12 h-12" : "w-10 h-10"}
                        ${
                          isActive(item.path)
                            ? "bg-white/20 text-white"
                            : "bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-white"
                        }
                      `}
                    >
                      <span className="w-5 h-5 block">
                        {isActive(item.path) && item.activeIcon
                          ? item.activeIcon
                          : item.icon}
                      </span>
                    </div>

                    {!isCollapsed && (
                      <span className="text-sm font-medium transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
