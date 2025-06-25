import React, { useState, useEffect, useMemo } from "react";
import useSecurityStore from "../../../stores/SecurityStore";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

const DeveloperRiskTable = () => {
  const { width } = useScreenSize();
  const isMobile = width < 768;

  // Selectively get only what we need from the store
  const loadInitialData = useSecurityStore((state) => state.loadInitialData);
  const cleanup = useSecurityStore((state) => state.cleanup);
  const repositories = useSecurityStore((state) => state.repositories);

  const repoStats = useMemo(() => {
    return useSecurityStore.getState().getRepositoryStats();
  }, [repositories]);

  // useSecurityStore.getState().repositories

  const sortedRepos = useMemo(() => {
    return [...repoStats].sort(
      (a, b) => b.verifiedFindings - a.verifiedFindings
    );
  }, [repoStats]);

  useEffect(() => {
    loadInitialData();
    return () => {
      cleanup();
    };
  }, [loadInitialData, cleanup]);

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...(isMobile ? {} : { year: "numeric" }),
    }).format(date);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return {
          bg: "rgba(255, 107, 107, 0.15)",
          color: "#ff6b6b",
          border: "#ff6b6b40",
        };
      case "High":
        return {
          bg: "rgba(247, 37, 133, 0.15)",
          color: "#F72585",
          border: "#F7258540",
        };
      case "Medium":
        return {
          bg: "rgba(255, 195, 0, 0.15)",
          color: "#FFC300",
          border: "#FFC30040",
        };
      case "Secure":
        return {
          bg: "rgba(0, 212, 255, 0.15)",
          color: "#00D4FF",
          border: "#00D4FF40",
        };
      default:
        return {
          bg: "rgba(128, 128, 128, 0.15)",
          color: "#808080",
          border: "#80808040",
        };
    }
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        borderRadius: isMobile ? "12px" : "16px",
        padding: isMobile ? "16px" : "20px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "14px" : "18px",
          fontWeight: "600",
          color: "#FFFFFF",
          fontFamily: "Inter, sans-serif",
          marginBottom: isMobile ? "16px" : "20px",
          letterSpacing: "-0.025em",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>
          {isMobile ? "Repository Findings" : "Repository Security Findings"}
          <span
            style={{
              fontSize: isMobile ? "10px" : "12px",
              color: "#A0A0A0",
              fontWeight: "400",
              marginLeft: "8px",
            }}
          >
            ({sortedRepos.length} repos)
          </span>
        </span>
      </h2>

      <div
        style={{
          overflowX: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
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
                  width: isMobile ? "40%" : "35%",
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
                  width: isMobile ? "30%" : "20%",
                }}
              >
                Unverified
              </th>
              {!isMobile && (
                <th
                  style={{
                    paddingBottom: "12px",
                    paddingTop: "4px",
                    color: "#E7EAF0",
                    fontWeight: "600",
                    textAlign: "center",
                    paddingRight: "12px",
                    width: "15%",
                  }}
                >
                  Verified
                </th>
              )}
              {!isMobile && (
                <th
                  style={{
                    paddingBottom: "12px",
                    paddingTop: "4px",
                    color: "#E7EAF0",
                    fontWeight: "600",
                    textAlign: "center",
                    paddingRight: "12px",
                    width: "15%",
                  }}
                >
                  Total
                </th>
              )}
              <th
                style={{
                  paddingBottom: "12px",
                  paddingTop: "4px",
                  color: "#E7EAF0",
                  fontWeight: "600",
                  textAlign: "right",
                  width: isMobile ? "30%" : "15%",
                }}
              >
                {isMobile ? "Last Scan" : "Last Scanned"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRepos
              .slice(0, isMobile ? 6 : undefined)
              .map((repo, index) => {
                return (
                  <tr
                    key={repo.id || index}
                    style={{
                      fontSize: isMobile ? "11px" : "13px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "background-color 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: isMobile
                          ? "12px 8px 12px 0"
                          : "16px 12px 16px 0",
                        color: "#E7EAF0",
                        fontWeight: "500",
                        maxWidth: isMobile ? "120px" : "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={`${repo.owner}/${repo.name}`}
                    >
                      {isMobile ? repo.name : `${repo.owner}/${repo.name}`}
                    </td>
                    <td
                      style={{ padding: isMobile ? "12px 8px" : "16px 12px" }}
                    >
                      <span>
                        <span
                          style={{
                            display: "inline-block",
                            width: isMobile ? "4px" : "6px",
                            height: isMobile ? "4px" : "6px",
                            borderRadius: "50%",
                            marginRight: isMobile ? "4px" : "6px",
                          }}
                        />
                        {repo.unverifiedFindings}
                      </span>
                    </td>
                    {!isMobile && (
                      <td
                        style={{
                          padding: "16px 12px",
                          textAlign: "center",
                          color: "#E7EAF0",
                          fontWeight: "500",
                        }}
                      >
                        {repo.verifiedFindings || 0}
                      </td>
                    )}
                    {!isMobile && (
                      <td
                        style={{
                          padding: "16px 12px",
                          textAlign: "center",
                          color: "#A0A0A0",
                          fontWeight: "400",
                        }}
                      >
                        {repo.totalFindings || 0}
                      </td>
                    )}
                    <td
                      style={{
                        padding: isMobile ? "12px 0" : "16px 0",
                        textAlign: "right",
                        color: "#A0A0A0",
                        fontSize: isMobile ? "10px" : "12px",
                      }}
                    >
                      {formatDate(repo.lastScanDate)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {sortedRepos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#A0A0A0",
            fontSize: isMobile ? "12px" : "14px",
            padding: "40px 20px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No repositories found
        </div>
      )}
    </section>
  );
};

export default DeveloperRiskTable;
