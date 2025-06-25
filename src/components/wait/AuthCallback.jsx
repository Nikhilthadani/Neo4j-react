// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useToaster } from '../../contexts/ToasterContext.js';
// // import { authApi } from "../../mocks/auth.js"

// // const AuthCallback = () => {
// //     const navigate = useNavigate();
// //     const [loading, setLoading] = useState(true);
// //     const { showToast } = useToaster();

// //     useEffect(() => {
// //         const handleAuthCallback = async () => {
// //             try {
// //                 const urlParams = new URLSearchParams(window.location.search);
// //                 const code = urlParams.get("code");
// //                 const state = urlParams.get("state");
// //                 const token = urlParams.get("token");

// //                 // Handle direct token (if backend sends token directly)
// //                 if (token) {
// //                     localStorage.setItem("accessToken", token);
// //                     const path = window.location.pathname;
// //                     setTimeout(() => {
// //                          console.log("this is the path which gives token",path)
// //                         showToast("Successfully logged in with GitHub!", "success" );
// //                         navigate("/dashboard", { replace: true });
// //                     },3000)

// //                     return;
// //                 }

// //                 // Handle code exchange flow
// //                 if (code) {
// //                     console.log("Exchanging code for token:", code);

// //                     // Call your backend to exchange code for JWT
// //                     const res = await authApi.githubCallback(code, state || '');
// //                     console.log("this is the response which came", res)
// //                     if (res.status === 200) {
// //                         const { jwt, user } = res.data;
// //                         localStorage.setItem("accessToken", jwt);
// //                         if (user?.id) {
// //                             localStorage.setItem("userId", user.id);
// //                         }

// //                         navigate("/dashboard", { replace: true });
// //                     }
// //                 } else {
// //                     // No code or token found

// //                     navigate("/login", { replace: true });
// //                 }
// //             } catch (error) {
// //                 console.error("Auth callback error:", error);

// //                 navigate("/login", { replace: true });
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         const r = handleAuthCallback();
// //     }, [navigate]);

// //     if (loading) {
// //         return (
// //             <div className="flex items-center justify-center min-h-screen">
// //                 <div className="text-center">
// //                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
// //                     <p className="mt-2">Completing GitHub authentication...</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return null;
// // };

// // export default AuthCallback;

// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useToaster } from '../../contexts/ToasterContext';
// import { authApi } from "../../mocks/auth";

// const AuthCallback = () => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);
//     const [urlParamsDebug, setUrlParamsDebug] = useState({});

//     const exchangeAttemptedRef = useRef(false);

//     useEffect(() => {
//         const handleAuthCallback = async () => {
//             // Prevent duplicate token exchange calls
//             if (exchangeAttemptedRef.current) {
//                 console.log("Token exchange already attempted, skipping");
//                 return;
//             }

//             exchangeAttemptedRef.current = true;

//             try {
//                 console.log("Current URL:", window.location.href);

//                 const urlParams = new URLSearchParams(window.location.search);
//                 const code = urlParams.get("code");

//                 // Save for debug UI
//                 setUrlParamsDebug({ code });

//                 // Handle code exchange flow
//                 if (code) {
//                     console.log("Exchanging code for token:", code);

//                     const res = await authApi.githubCallback(code);
//                     console.log("Backend response:", res);

//                     if (res.status === 200) {
//                         const { jwt, user } = res.data;
//                         localStorage.setItem("jwt", jwt); // Store in both places for consistency
//                         if (user?.id) {
//                             localStorage.setItem("userId", user.id);
//                         }

//                         navigate("/dashboard", { replace: true });
//                     }
//                 } else {
//                     console.warn("No code or token found in URL.");
//                     navigate("/login", { replace: true });
//                 }
//             } catch (error) {
//                 console.error("Auth callback error:", error);
//                 navigate("/login", { replace: true });
//             } finally {
//                 setLoading(false);
//             }
//         };

//         handleAuthCallback();
//     }, [navigate]);

//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//                     <p className="mt-2">Completing GitHub authentication...</p>

//                     {/* Debug Info (visible only for development) */}
//                     <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-left max-w-md mx-auto">
//                         <p><strong>URL:</strong> {window.location.href}</p>
//                         <p><strong>Code:</strong> {urlParamsDebug.code || 'N/A'}</p>
//                         <p><strong>State:</strong> {urlParamsDebug.state || 'N/A'}</p>
//                         <p><strong>Token:</strong> {urlParamsDebug.token || 'N/A'}</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return null;
// };

// export default AuthCallback;

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Github, Loader2, AlertCircle } from "lucide-react";
import { useToaster } from "../../contexts/ToasterContext";
import { authApi } from "../../mocks/auth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [urlParamsDebug, setUrlParamsDebug] = useState({});
  const [error, setError] = useState(null);

  const exchangeAttemptedRef = useRef(false);
  const { showToast } = useToaster();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (exchangeAttemptedRef.current) {
        console.log("Token exchange already attempted, skipping");
        return;
      }

      exchangeAttemptedRef.current = true;

      try {
        setStatus("Parsing authentication data...");
        setProgress(25);

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        setUrlParamsDebug({ code });

        if (code) {
          setStatus("Exchanging code for token...");
          setProgress(50);

          const res = await authApi.githubCallback(code);

          setStatus("Validating credentials...");
          setProgress(75);

          if (res.status === 200) {
            const { jwt } = res.data;
            localStorage.setItem("jwt", jwt);

            setStatus("Authentication successful!");
            setProgress(100);

            // Wait 5 seconds before navigating
            await new Promise((resolve) => setTimeout(resolve, 2000));

            showToast("Successfully logged in with GitHub!", "success");
            navigate("/dashboard", { replace: true });
          }
        } else {
          setError("Authentication code not found");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, showToast]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full w-full"></div>
            </div>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="bg-[#21262d] border border-[#30363d] rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#f0f6fc] mb-2">
            Authenticating
          </h2>
          <p className="text-[#8b949e]">
            Completing your GitHub authentication...
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8b949e]">{status}</span>
              <span className="text-[#6e7681]">{progress}%</span>
            </div>
            <div className="w-full bg-[#30363d] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#238636] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            {progress === 100 ? (
              <div className="flex items-center space-x-2 text-[#238636]">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Complete!</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-[#58a6ff]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Processing...</span>
              </div>
            )}
          </div>

          {import.meta.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-[#161b22] border border-[#30363d] rounded-md">
              <h3 className="text-sm font-semibold text-[#f0f6fc] mb-3">
                Debug Information
              </h3>
              <div className="space-y-2 text-xs text-[#8b949e]">
                <div className="flex justify-between">
                  <span>URL:</span>
                  <span className="font-mono text-right max-w-48 truncate text-[#a5a5a5]">
                    {window.location.href}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Code:</span>
                  <span className="font-mono text-[#238636]">
                    {urlParamsDebug.code ? "✓ Present" : "✗ Missing"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#6e7681]">Secured by GitHub OAuth 2.0</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
