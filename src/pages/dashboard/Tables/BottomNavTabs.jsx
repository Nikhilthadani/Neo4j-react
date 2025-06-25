import React from 'react'
import { DASHBOARD_BOTTOM_NAV_TABS_DATA } from '../../../constants/dashboardBottomNavTabsData'
import SearchBar from '../../../components/common/SearchBar'
import { useState, useEffect } from 'react'


const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
      width: typeof window !== "undefined" ? window.innerWidth : 1200,
      height: typeof window !== "undefined" ? window.innerHeight : 800,
    })
  
    useEffect(() => {
      const handleResize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
  
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])
  
    return screenSize
  }


const BottomNavTabs = () => {

    const { width } = useScreenSize()
    const isMobile = width < 768
    const [activeTab, setActiveTab] = useState("cloud")
    const [searchQuery, setSearchQuery] = useState("")
  
    const data = DASHBOARD_BOTTOM_NAV_TABS_DATA
  
    const handleSearch = (e) => {
      setSearchQuery(e.target.value)
    }
  
    const filteredData = data[activeTab].filter((item) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        (item.severity && item.severity.toLowerCase().includes(query)) ||
        (item.tokenType && item.tokenType.toLowerCase().includes(query)) ||
        (item.repository && item.repository.toLowerCase().includes(query)) ||
        (item.developer && item.developer.toLowerCase().includes(query))
      )
    })
  
  
    return (
      <section
        style={{
          background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
          borderRadius: isMobile ? "12px" : "16px",
          padding: isMobile ? "16px" : "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: isMobile ? "16px" : "24px",
            gap: isMobile ? "4px" : "8px",
            overflowX: "auto",
            paddingBottom: isMobile ? "4px" : "0",
            width: "100%"
          }}
        >
          {[
            { key: "cloud", label: isMobile ? "Cloud" : "Cloud Infrastructure" },
            { key: "saas", label: "SaaS" },
            { key: "storage", label: "Storage" },
            { key: "code", label: isMobile ? "Code" : "Code Repositories" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: isMobile ? "8px 12px" : "10px 16px",
                borderRadius: "8px",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                background: activeTab === tab.key ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: activeTab === tab.key ? "#FFFFFF" : "#A0A0A0",
                border: "none",
                cursor: "pointer",
                minWidth: "fit-content"
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
  
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "16px",
            marginBottom: isMobile ? "16px" : "24px",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <div style={{ width: isMobile ? "100%" : "300px" }}>
            <SearchBar placeholder="Search secrets..." value={searchQuery} onChange={handleSearch} />
          </div>
        </div>
  
        <div style={{ 
          overflowX: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }}>
          <table style={{ 
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed"
          }}>
            <thead>
              <tr
                style={{
                  fontSize: isMobile ? "11px" : "13px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <th
                  style={{
                    paddingBottom: "12px",
                    paddingTop: "4px",
                    color: "#E7EAF0",
                    fontWeight: "600",
                    textAlign: "left",
                    paddingRight: isMobile ? "8px" : "12px",
                    width: isMobile ? "25%" : "20%"
                  }}
                >
                  Repository
                </th>
                <th
                  style={{
                    paddingBottom: "12px",
                    paddingTop: "4px",
                    color: "#E7EAF0",
                    fontWeight: "600",
                    textAlign: "left",
                    paddingRight: isMobile ? "8px" : "12px",
                    width: isMobile ? "20%" : "15%"
                  }}
                >
                  Severity
                </th>
                <th
                  style={{
                    paddingBottom: "12px",
                    paddingTop: "4px",
                    color: "#E7EAF0",
                    fontWeight: "600",
                    textAlign: "left",
                    paddingRight: isMobile ? "8px" : "12px",
                    width: isMobile ? "25%" : "20%"
                  }}
                >
                  Token Type
                </th>
                {!isMobile && (
                  <th
                    style={{
                      paddingBottom: "12px",
                      paddingTop: "4px",
                      color: "#E7EAF0",
                      fontWeight: "600",
                      textAlign: "left",
                      paddingRight: "12px",
                      width: "15%"
                    }}
                  >
                    Developer
                  </th>
                )}
                {!isMobile && (
                  <th
                    style={{
                      paddingBottom: "12px",
                      paddingTop: "4px",
                      color: "#E7EAF0",
                      fontWeight: "600",
                      textAlign: "left",
                      paddingRight: "12px",
                      width: "15%"
                    }}
                  >
                    Last Updated
                  </th>
                )}
               
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      fontSize: isMobile ? "11px" : "13px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "background-color 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td
                      style={{
                        padding: isMobile ? "12px 8px 12px 0" : "16px 12px 16px 0",
                        color: "#E7EAF0",
                        fontWeight: "500",
                        maxWidth: isMobile ? "120px" : "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.repository}
                    >
                      {item.repository}
                    </td>
                    <td style={{ padding: isMobile ? "12px 8px" : "16px 12px" }}>
                      <span
                        style={{
                          padding: isMobile ? "4px 8px" : "6px 12px",
                          borderRadius: "20px",
                          fontSize: isMobile ? "9px" : "11px",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: isMobile ? "50px" : "70px",
                          background:
                            item.severity === "Critical"
                              ? "rgba(255, 107, 107, 0.15)"
                              : item.severity === "High"
                                ? "rgba(247, 37, 133, 0.15)"
                                : item.severity === "Medium"
                                  ? "rgba(255, 195, 0, 0.15)"
                                  : "rgba(0, 212, 255, 0.15)",
                          color:
                            item.severity === "Critical"
                              ? "#ff6b6b"
                              : item.severity === "High"
                                ? "#F72585"
                                : item.severity === "Medium"
                                  ? "#FFC300"
                                  : "#00D4FF",
                          border: `1px solid ${
                            item.severity === "Critical"
                              ? "#ff6b6b"
                              : item.severity === "High"
                                ? "#F72585"
                                : item.severity === "Medium"
                                  ? "#FFC300"
                                  : "#00D4FF"
                          }40`,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: isMobile ? "4px" : "6px",
                            height: isMobile ? "4px" : "6px",
                            borderRadius: "50%",
                            marginRight: isMobile ? "4px" : "6px",
                            backgroundColor:
                              item.severity === "Critical"
                                ? "#ff6b6b"
                                : item.severity === "High"
                                  ? "#F72585"
                                  : item.severity === "Medium"
                                    ? "#FFC300"
                                    : "#00D4FF",
                          }}
                        />
                        {item.severity}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: isMobile ? "12px 8px" : "16px 12px",
                        color: "#D8D8D8",
                        fontSize: isMobile ? "10px" : "13px",
                        fontFamily: "Inter, sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isMobile ? item.tokenType.split(" ")[0] : item.tokenType}
                    </td>
                    {!isMobile && (
                      <td
                        style={{
                          padding: "16px 12px",
                          color: "#D8D8D8",
                          fontSize: "13px",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {item.developer}
                      </td>
                    )}
                    
                      {!isMobile && (
                      <td
                        style={{
                          padding: "16px 12px",
                          color: "#A0A0A0",
                          fontSize: "12px",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {item.scanTime}
                      </td>
                    )}
               
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isMobile ? "4" : "6"}
                    style={{
                      padding: isMobile ? "32px 16px" : "48px 24px",
                      textAlign: "center",
                      color: "#A0A0A0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: isMobile ? "12px" : "16px",
                      }}
                    >
                      <svg
                        style={{
                          width: isMobile ? "32px" : "48px",
                          height: isMobile ? "32px" : "48px",
                          color: "#666",
                        }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <div>
                        <p style={{ fontSize: isMobile ? "14px" : "16px", marginBottom: "8px" }}>
                          No matching secrets found
                        </p>
                        <p style={{ fontSize: isMobile ? "12px" : "14px", color: "#666" }}>
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    )
  }
export default BottomNavTabs