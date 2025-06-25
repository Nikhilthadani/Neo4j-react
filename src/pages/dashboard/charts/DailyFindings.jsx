import React, { useState, useEffect, useMemo } from 'react';
import useSecurityStore from "../../../stores/SecurityStore";
import ReactApexChart from "react-apexcharts";

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

const DailyFindings = () => {
  const { width } = useScreenSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // Get only what we need from the store
  const loadInitialData = useSecurityStore((state) => state.loadInitialData);
  const cleanup = useSecurityStore((state) => state.cleanup);
  const repositories = useSecurityStore((state) => state.repositories);

  // Use useMemo for derived data
  const riskScorePerDay = useMemo(() => {
    return useSecurityStore.getState().getDailyRiskScores();
  }, [repositories]);
  //useSecurityStore.getState().repositories]

  // Load data on mount
  useEffect(() => {
    loadInitialData();
    return () => cleanup();
  }, [loadInitialData, cleanup]);

  // Memoize chart options to prevent unnecessary recalculations
  const chartOptions = useMemo(() => ({
    chart: {
      type: "line",
      toolbar: { show: false },  
      zoom: { enabled: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    xaxis: {
      categories: riskScorePerDay.map((d) => d.date),
      title: {
        text: "Date",
        style: { 
          color: "#888", 
          fontSize: isMobile ? "12px" : "14px" 
        }
      },
      labels: { 
        style: { 
          colors: "#ccc", 
          fontSize: isMobile ? "10px" : "12px" 
        } 
      },
      axisBorder: { color: "#555" },
      axisTicks: { color: "#555" },
    },
    yaxis: {
      title: {
        text: "Risk score",
        style: { 
          color: "#888", 
          fontSize: isMobile ? "12px" : "14px" 
        }
      },
      labels: { 
        style: { 
          colors: "#ccc", 
          fontSize: isMobile ? "10px" : "12px" 
        } 
      },
    },
    grid: {
      borderColor: "#333",
      strokeDashArray: 4,
      padding: {
        top: isMobile ? 10 : 20,
        right: isMobile ? 10 : 20,
        bottom: isMobile ? 10 : 20,
        left: isMobile ? 10 : 20,
      }
    },
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
      colors: ["#4dabf7"],
    },
    markers: {
      size: isMobile ? 4 : 6,
      colors: ["#4dabf7"],
      strokeColors: "#1c7ed6",
      strokeWidth: isMobile ? 1 : 2,
      hover: { sizeOffset: 3 },
    },
    tooltip: {
      theme: "dark",
      x: { format: "yyyy-MM-dd" }
    }
  }), [isMobile, riskScorePerDay]);

  // Memoize series data
  const series = useMemo(() => [{
    name: "Risk Score",
    data: riskScorePerDay.map((d) => Math.round(d.riskScore * 100)),
  }], [riskScorePerDay]);

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        borderRadius: isMobile ? "12px" : "16px",
        padding: isMobile ? "16px" : "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "14px" : "18px",
          fontWeight: "600",
          color: "#FFFFFF",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "-0.025em",
          marginBottom: isMobile ? "12px" : "16px",
        }}
      >
        Daily Risk Trends
      </h2>
      <div
        style={{
          flex: 1,
          minHeight: isMobile ? "200px" : isTablet ? "250px" : "300px",
          width: "100%",
        }}
      >
        <ReactApexChart 
          options={chartOptions} 
          series={series} 
          type="line" 
          height={isMobile ? 200 : isTablet ? 250 : 300} 
          width="100%" 
        />
      </div>
    </section>
  );
};

export default DailyFindings;
