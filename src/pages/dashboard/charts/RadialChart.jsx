import React, { useState, useEffect, useMemo } from 'react'
import ReactApexChart from "react-apexcharts"
import { useSecurityStore } from "../../../stores/SecurityStore";

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

const RadialChart = () => {
  const { width } = useScreenSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  
  const loadInitialData = useSecurityStore((state) => state.loadInitialData);
  const cleanup = useSecurityStore((state) => state.cleanup);
  const repositories = useSecurityStore((state) => state.repositories);

  const aggregated = useMemo(() => {
    return useSecurityStore.getState().getAggregatedCounts();
  }, [repositories]);
  //useSecurityStore.getState().repositories
 
  useEffect(() => {
    loadInitialData();
    return () => cleanup();
  }, [loadInitialData, cleanup]);

  // Add null checks and defaults
  const verifiedCount = aggregated?.verifiedFindings ?? 0;
  const unverifiedCount = aggregated?.unverifiedFindings ?? 0;
  const totalSecrets = verifiedCount + unverifiedCount;

  // Memoize chart data - moved before conditional return
  const chartData = useMemo(() => ({
    series: [verifiedCount, unverifiedCount],
    options: {
      chart: {
        type: "donut",
        height: isMobile ? 200 : isTablet ? 250 : 300,
        toolbar: { show: false },
        background: "transparent",
        fontFamily: "Inter, sans-serif",
      },
      labels: ["Active", "Unvalidated Keys"],
      colors: ["#FF4C4C","#efea86"], // Orange + Teal
      plotOptions: {
        pie: {
          donut: {
            size: isMobile ? "60%" : isTablet ? "65%" : "70%",
            labels: {
              show: true,
              name: {
                show: true,
                color: "#ffffff",
                fontSize: isMobile ? "9px" : isTablet ? "11px" : "12px",
                fontWeight: 500,
                offsetY: isMobile ? 25 : isTablet ? 35 : 40,
              },
              value: {
                show: true,
                fontSize: isMobile ? "18px" : isTablet ? "24px" : "32px",
                fontWeight: "600",
                color: "#ffffff",
                offsetY: isMobile ? -6 : -8,
                formatter: () => totalSecrets.toString(),
              },
              total: {
                show: true,
                showAlways: true,
                label: "Total Secrets",
                fontSize: isMobile ? "9px" : isTablet ? "11px" : "12px",
                color: "#ffffff",
                fontWeight: "400",
                offsetY: isMobile ? 15 : isTablet ? 25 : 30,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        fontSize: isMobile ? "10px" : isTablet ? "12px" : "14px",
        fontWeight: "400",
        labels: {
          colors: "#ffffff",
        },
        markers: {
          width: isMobile ? 5 : isTablet ? 6 : 8,
          height: isMobile ? 5 : isTablet ? 6 : 8,
          radius: isMobile ? 2 : isTablet ? 3 : 4,
        },
        itemMargin: {
          horizontal: isMobile ? 6 : isTablet ? 8 : 12,
          vertical: isMobile ? 4 : isTablet ? 6 : 8,
        },
        offsetY: isMobile ? 8 : isTablet ? 5 : 0,
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val) => `${val} secrets`,
        },
      },
    },
  }), [isMobile, isTablet, verifiedCount, unverifiedCount, totalSecrets]);
  
  // Early return if no data - moved after all hooks
  if (totalSecrets === 0) {
    return (
      <section className="bg-[#1e1e1e] border border-white/10 shadow-md rounded-lg p-6 min-h-[300px] flex flex-col justify-center items-center text-white">
        <p className="text-sm">No findings to visualize yet.</p>
      </section>
    );
  }
      
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
        Secrets Distribution
      </h2>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: isMobile ? "200px" : isTablet ? "250px" : "300px",
          paddingBottom: isMobile ? "8px" : "0px",
          overflowX:"hidden"
        }}
      >
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          height={isMobile ? 200 : isTablet ? 250 : 300}
        />
      </div>
    </section>
  );
};

export default RadialChart;