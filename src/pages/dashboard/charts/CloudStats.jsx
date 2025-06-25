import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

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
const CloudStats = () => {
  const { width } = useScreenSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const chartData = {
    series: [
      {
        name: "Secrets Found",
        data: [124, 98, 76, 153], // GitHub, AWS, GCP, SaaS
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: isMobile ? 180 : 280,
        toolbar: { show: false },
        background: "transparent",
        fontFamily: "Inter, sans-serif",
      },
      colors: ["#A9DFD8"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: isMobile ? "50%" : "40%",
          borderRadius: 6,
        },
      },
      xaxis: {
        categories: ["GitHub", "AWS", "GCP", "SaaS"],
        labels: {
          style: {
            colors: "#aaa",
            fontSize: isMobile ? "10px" : "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#aaa",
            fontSize: isMobile ? "10px" : "12px",
          },
        },
        title: {
          text: "Secrets",
          style: {
            color: "#aaa",
            fontSize: isMobile ? "12px" : "14px",
          },
        },
      },
      grid: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        strokeDashArray: 3,
      },
      tooltip: { theme: "dark" },
      theme: { mode: "dark" },
    },
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        borderRadius: isMobile ? "12px" : "16px",
        padding: isMobile ? "16px" : "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isMobile ? "16px" : "20px",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "8px" : "0",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "14px" : "18px",
            fontWeight: "600",
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-0.025em",
          }}
        >
          Secrets Across Environments
        </h2>
      </div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={isMobile ? 160 : isTablet ? 200 : 250}
      />
    </section>
  );
};

export default CloudStats;
