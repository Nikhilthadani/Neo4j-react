import React, { useState, useEffect, useMemo } from 'react'
import ReactApexChart from "react-apexcharts"
import { useSecurityStore } from '../../../stores/SecurityStore';

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

const TotalSecretsChart = () => {
  const { width } = useScreenSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [chartKey, setChartKey] = useState(0); 

  const loadInitialData = useSecurityStore((state) => state.loadInitialData);
  const cleanup = useSecurityStore((state) => state.cleanup);
  const repositories = useSecurityStore((state) => state.repositories);

  const { averageRiskScore } = useMemo(() => {
    const totalVerified = repositories.reduce((sum, repo) => sum + (repo.verifiedFindings || 0), 0);
    const totalUnverified = repositories.reduce((sum, repo) => sum + (repo.unverifiedFindings || 0), 0);
    const total = totalVerified + totalUnverified;
    return {
      averageRiskScore: total > 0 ? totalVerified / total : 0
    };
  }, [repositories]);

  


  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [repositories]);




  // useEffect(() => {
  //   const initializeData = async () => {
  //     await loadInitialData();
  //     startPolling();
  //   };
    
  //   initializeData();
   
  //   // Cleanup on unmount
  //   return () => {
  //     stopPolling();
  //     cleanup();
  //   };
  // }, [loadInitialData, startPolling, stopPolling, cleanup]);


    useEffect(() => {
      loadInitialData();
      return () => cleanup();
    }, [loadInitialData, cleanup]);
  


  // Memoize chart options
  const options = useMemo(() => ({
    chart: {
      type: 'radialBar',
      height: isMobile ? 200 : isTablet ? 250 : 300,
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: isMobile ? '60%' : '65%',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: isMobile ? '12px' : '14px',
            color: '#ccc',
            offsetY: isMobile ? 30 : 40,
          },
          value: {
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 600,
            color: '#fff',
            offsetY: isMobile ? -8 : -10,
            formatter: () => `${Math.round(averageRiskScore * 100)}/100`
          }
        },
      },
    },
    labels: ['Risk Score'],
    colors: ['#FF4C4C'],
  }), [isMobile, isTablet, averageRiskScore]);

  // Memoize series data
  const series = useMemo(() => [Math.round(averageRiskScore * 100)], [averageRiskScore]);

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
        Risk Score
      </h2>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: isMobile ? "200px" : isTablet ? "250px" : "300px",
          overflowX:"hidden"
        }}
      >
        <ReactApexChart 
          key={chartKey}
          options={options} 
          series={series} 
          type="radialBar" 
          height={isMobile ? 200 : isTablet ? 250 : 300} 
        />
      </div>
    </section>
  );
}

export default TotalSecretsChart
 