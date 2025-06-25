import React, { useState, useEffect } from "react";
import AnalyticsHeader from "./charts/Analytics";
import TotalSecretsChart from "./charts/TotalSecrets";
import RadialChart from "./charts/RadialChart";
import CloudStats from "./charts/CloudStats";
import Insights from "./charts/Insights";
import DeveloperRiskTable from "./Tables/DeveloperRiskTable";
import BottomNavTabs from "./Tables/BottomNavTabs";
import DailyFindings from "./charts/DailyFindings";
import { useSecurityStore } from "../../stores/SecurityStore";

// Hook to detect screen size
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

const DashboardPage = () => {
  const { width } = useScreenSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const { loadInitialData, cleanup } = useSecurityStore();

  useEffect(() => {
    loadInitialData();

    // Optional cleanup on unmount
    return () => {
      cleanup(); // stops polling cleanly
    };
  }, [loadInitialData, cleanup]);

  return (
    <main
      style={{
        background: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
        color: "#ffffff",
        padding: isMobile ? "8px" : isTablet ? "12px" : "16px",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
      className="w-full"
    >
      <div
        style={{
          padding: isMobile ? "12px" : isTablet ? "16px" : "20px",
          background: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
          borderRadius: isMobile ? "16px" : "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "16px" : isTablet ? "20px" : "24px",
        }}
        className="flex flex-col w-full"
      >
        <AnalyticsHeader />

        {/* Analytics Overview Section */}
        <section
          style={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                ? "1fr 1fr"
                : "1fr 2fr 1fr",
              gap: isMobile ? "12px" : isTablet ? "16px" : "20px",
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              alignItems: "stretch",
            }}
          >
            {/* Left Pie Chart */}
            <div style={{ width: "100%", minWidth: 0 }}>
              <TotalSecretsChart />
            </div>

            {/* Bar Chart (center, larger) */}
            <div style={{ width: "100%", minWidth: 0 }}>
              <DailyFindings />
            </div>

            {/* Right Pie Chart */}
            <div style={{ width: "100%", minWidth: 0 }}>
              <RadialChart />
            </div>
          </div>
        </section>

        {/* Trends Section */}
        <section
          style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
        >
          <CloudStats />
        </section>

        {/* Analysis Section */}
        <section
          style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "12px" : isTablet ? "16px" : "20px",
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              alignItems: "stretch",
            }}
          >
            <Insights />
            <DeveloperRiskTable />
          </div>
        </section>

        {/* Detailed Data Section */}
        <section
          style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
        >
          <BottomNavTabs />
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
