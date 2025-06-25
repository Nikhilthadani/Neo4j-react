import React, { useState, useEffect } from 'react'

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
const AnalyticsHeader = () => {
    const { width } = useScreenSize()
    const isMobile = width < 768
  
    return (
      <header
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: isMobile ? "1rem" : "1.5rem",
          color: "white",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: isMobile ? "1rem" : "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            fontWeight: "600",
            opacity: "0.9",
          }}
        >
          <img
            src="/dashboard.svg"
            alt="Dashboard"
            style={{
              width: isMobile ? "20px" : "24px",
              height: isMobile ? "20px" : "24px",
              marginRight: isMobile ? "8px" : "12px",
            }}
          />
          <span>{isMobile ? "Dashboard" : "StackGuard Security Dashboard"}</span>
        </div>
      </header>
    )
  }
  

export default AnalyticsHeader