import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Shield, Bell, Globe, LogOut } from "lucide-react";

const settingsSchema = z.object({
  siteName: z
    .string()
    .min(2, "Site name must be at least 2 characters")
    .max(50, "Site name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s-_]+$/, "Only letters, numbers, spaces, hyphens, and underscores"),
  emailNotifications: z.boolean(),
  twoFactorAuth: z.boolean(),
});

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "My Awesome Site",
      emailNotifications: true,
      twoFactorAuth: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Settings saved:", data);
    setIsLoading(false);
    setShowSuccess(true);
    alert("Settings saved successfully!");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const sectionStyle = {
    backgroundColor: "#1a1a1a",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "32px",
    border: "1px solid #333",
  };

  const labelStyle = {
    color: "#ccc",
    fontWeight: 500,
    display: "block",
    marginBottom: "8px",
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#111",
    color: "#fff",
    padding: "12px",
    border: "1px solid #444",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  const checkboxWrapper = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    border: "1px solid #333",
    borderRadius: "10px",
    backgroundColor: "#1e1e1e",
    marginBottom: "12px",
  };

  const toggleStyle = {
    width: "48px",
    height: "24px",
    backgroundColor: "#333",
    borderRadius: "9999px",
    position: "relative",
    transition: "all 0.3s",
  };

  const toggleCircle = {
    width: "20px",
    height: "20px",
    backgroundColor: "#ccc",
    borderRadius: "9999px",
    position: "absolute",
    top: "2px",
    left: "2px",
    transition: "all 0.3s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #0f0f0f, #1a1a1a)",
        color: "#fff",
        padding: "40px",
        border: "1px solid #333",
      }}
    >
      <motion.div
        style={{ maxWidth: "100%", margin: "0 auto" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "white",
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          
          Settings
        </motion.h1>
        <p style={{ color: "#aaa", marginBottom: "20px" }}>
          Customize your experience and manage your preferences
        </p>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              style={{
                backgroundColor: "#2e7d32",
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
            >
              <CheckCircle />
              <span>Settings saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* General Settings */}
          <motion.div style={sectionStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Globe />
              <h2 style={{ fontSize: "20px", fontWeight: 600 }}>General Settings</h2>
            </div>

            <label style={labelStyle}>Site Name</label>
            <input
              {...register("siteName")}
              type="text"
              style={inputStyle}
              autoComplete="off"
              spellCheck={false}
              placeholder="Enter your site name"
            />
            {errors.siteName && (
              <p style={{ color: "#f44336", marginTop: "8px" }}>{errors.siteName.message}</p>
            )}
            <p style={{ color: "#777", fontSize: "12px", marginTop: "4px" }}>
              This will be used as your site's display name.
            </p>

            <div style={{ ...checkboxWrapper, marginTop: "24px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
                  <Bell />
                  Email Notifications
                </div>
                <p style={{ color: "#777", fontSize: "12px" }}>
                  Receive email updates about your account activity
                </p>
              </div>
              <label style={{ position: "relative" }}>
                <input type="checkbox" {...register("emailNotifications")} style={{ display: "none" }} />
                <div style={{ ...toggleStyle, backgroundColor: watch("emailNotifications") ? "#00bfa5" : "#333" }}>
                  <div
                    style={{
                      ...toggleCircle,
                      transform: watch("emailNotifications") ? "translateX(24px)" : "translateX(0)",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
              </label>
            </div>
          </motion.div>

          <motion.div style={sectionStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Shield />
              <h2 style={{ fontSize: "20px", fontWeight: 600 }}>Security Settings</h2>
            </div>

            <div style={checkboxWrapper}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
                  <Shield />
                  Two-Factor Authentication
                </div>
                <p style={{ color: "#777", fontSize: "12px" }}>
                  Add an extra layer of protection to your account
                </p>
              </div>
              <label style={{ position: "relative" }}>
                <input type="checkbox" {...register("twoFactorAuth")} style={{ display: "none" }} />
                <div style={{ ...toggleStyle, backgroundColor: watch("twoFactorAuth") ? "#4caf50" : "#333" }}>
                  <div
                    style={{
                      ...toggleCircle,
                      transform: watch("twoFactorAuth") ? "translateX(24px)" : "translateX(0)",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
              </label>
            </div>

            <div style={checkboxWrapper}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
                  <LogOut />
                  Session Management
                </div>
                <p style={{ color: "#777", fontSize: "12px" }}>
                  Sign out from your current session
                </p>
              </div>
              <motion.button
                type="button"
                onClick={() => console.log("User signed out")}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#330000",
                  color: "#ff5252",
                  border: "1px solid #ff1744",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </motion.button>
            </div>
          </motion.div>

          <motion.button
  type="submit"
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  disabled={isLoading}
  style={{
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: 600,
    fontSize: "16px",
    padding: "12px 28px",
    borderRadius: "12px",
    border: "1px solid #333",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    letterSpacing: "0.5px",
    fontFamily: "Inter, sans-serif",
  }}
>
  {isLoading ? "Saving..." : "Save Settings"}
</motion.button>

        </form>
      </motion.div>
    </div>
  );
};

export default SettingsPage;