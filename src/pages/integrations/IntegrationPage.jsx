import axios from "axios";
import React, { useEffect, useState } from "react";

const IntegrationPage = () => {
  const [data, setData] = useState([]);
  const [is404, setIs404] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log(data);

  const integrations = [
    {
      icon: "https://img.icons8.com/?size=100&id=wU62u24brJ44&format=png&color=000000",
      label: "AWS",
      href: "/integration/aws",
      description:
        "Amazon Web Services - Cloud computing platform with comprehensive security and monitoring tools",
      color: "#4285F4",
      category: "Cloud Provider",
    },
    {
      icon: "https://img.icons8.com/color/48/000000/azure-1.png",
      label: "Azure",
      href: "/integration/azure",
      description:
        "Microsoft Azure - Enterprise cloud platform with integrated security and compliance features",
      color: "#0078D4",
      category: "Cloud Provider",
    },
    {
      icon: "https://img.icons8.com/color/48/000000/google-cloud.png",
      label: "GCP",
      href: "/integration/gcp",
      description:
        "Google Cloud Platform - Scalable cloud infrastructure with advanced analytics and AI services",
      color: "#4285F4",
      category: "Cloud Provider",
    },
    {
      icon: "https://img.icons8.com/?size=100&id=106501&format=png&color=000000",
      label: "AWS S3",
      href: "/integration/",
      description: "Cloud Storage via AWS",
      color: "#4285F4",
      category: "Cloud Storage",
    },

    {
      icon: "https://img.icons8.com/?size=100&id=84283&format=png&color=000000",
      label: "Azure BlockStorage",
      href: "/integration/",
      description: "BlockStorage",
      color: "#4285F4",
      category: "Cloud Storage",
    },

    {
      icon: "https://img.icons8.com/?size=100&id=Mx78oJM2Fbo8&format=png&color=000000",
      label: "Google Cloud Storage",
      href: "/integration/",
      description: "Google Cloud Storage",
      color: "#4285F4",
      category: "Cloud Storage",
    },

    {
      icon: "https://img.icons8.com/?size=100&id=iEBcQcM9rnZ9&format=png&color=000000",
      label: "Github",
      href: "/integration/github",
      description: "Github",
      color: "#4285F4",
      category: "Codebase",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_URL}api/auth/repolist`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setData(response.data);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 404) {
          setIs404(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main
        style={{
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: "18px",
            fontFamily: "Inter, sans-serif",
            fontWeight: "500",
          }}
        >
          Loading...
        </div>
      </main>
    );
  }
  // if (is404) {
  //     return (
  //         <main
  //             style={{
  //                 background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
  //                 minHeight: "100vh",
  //                 display: "flex",
  //                 alignItems: "center",
  //                 justifyContent: "center",
  //                 padding: "0px",
  //             }}
  //         >
  //             <div style={{
  //                 color: "#FFFFFF",
  //                 fontSize: "18px",
  //                 fontFamily: "Inter, sans-serif",
  //                 fontWeight: "500"
  //             }}>
  //                 Something went wrong, please try again later
  //             </div>
  //         </main>
  //     );
  // }

  return (
    <main
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        minHeight: "100vh",
        padding: "0px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #19191C 0%, #27272A 100%)",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* Header Section */}
        <header
          style={{
            background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
            padding: "32px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Breadcrumb navigation */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "14px",
            }}
          >
            <img
              src="/integration.svg"
              alt="Integrations"
              style={{
                width: "20px",
                height: "20px",
                filter: "brightness(0.8)",
              }}
            />
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Integration
            </span>
          </nav>

          {/* Section title */}
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.025em",
                marginBottom: "8px",
              }}
            >
              Marketplace
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "Inter, sans-serif",
                lineHeight: "1.5",
              }}
            >
              Connect your cloud services and repositories to enhance your
              security monitoring
            </p>
          </div>
        </header>

        {/* Content Section */}
        <section
          style={{
            padding: "32px",
            background: "linear-gradient(135deg, #19191C 0%, #27272A 100%)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 2fr)",
              gap: "32px",
              maxWidth: "2000px",
              margin: "0 auto",
            }}
          >
            {integrations.map((integration, index) => (
              <article
                key={index}
                style={{
                  background:
                    "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  minHeight: "220px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 64px rgba(0, 0, 0, 0.4)";
                  e.currentTarget.style.borderColor = integration.color + "40";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.1)";
                }}
                onClick={() => {
                  if (integration.href) {
                    window.location.href = integration.href;
                  }
                }}
              >
                {/* Background accent */}
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "4px",
                    background: `linear-gradient(90deg, ${integration.color} 0%, ${integration.color}80 100%)`,
                  }}
                />

                {/* Header with Icon and Status */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "16px",
                      background: `linear-gradient(135deg, ${integration.color}20 0%, ${integration.color}10 100%)`,
                      border: `1px solid ${integration.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={integration.icon}
                      alt={integration.label}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                        filter: "brightness(1.1)",
                      }}
                    />
                  </div>

                  {/* Status and Category */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        background: `${integration.color}20`,
                        border: `1px solid ${integration.color}30`,
                        fontSize: "12px",
                        fontWeight: "500",
                        color: integration.color,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {integration.category}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: "600",
                      color: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      marginBottom: "8px",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {integration.label}
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "1.5",
                      margin: 0,
                    }}
                  >
                    {integration.description}
                  </p>
                </div>

                {/* Action Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <button
                    style={{
                      padding: "10px 20px",
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${integration.color} 0%, ${integration.color}CC 100%)`,
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      fontWeight: "600",
                      fontFamily: "Inter, sans-serif",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Connect
                  </button>
                </div>
              </article>
            ))}
          </div>

          <footer
            style={{
              marginTop: "48px",
              padding: "32px",
              background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            {[
              { label: "Available Integrations", value: integrations.length },
              {
                label: "Active Connections",
                value: Math.floor(integrations.length * 0.6),
              },
              {
                label: "Categories",
                value: [...new Set(integrations.map((i) => i.category))].length,
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#A9DFD8",
                    fontFamily: "Inter, sans-serif",
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </footer>
        </section>
      </div>
    </main>
  );
};

export default IntegrationPage;
