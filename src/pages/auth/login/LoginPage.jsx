import React, { useState } from "react";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useToaster } from "../../../contexts/ToasterContext";
import { authApi } from "../../../mocks/auth";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToaster();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      console.log("Login attempt with:", values);
      const loginResponse = await authApi.login(values);
      console.log("Login response:", loginResponse);

      if (loginResponse?.jwt) {
        showToast("Login successful!", "success");
        navigate("/dashboard");
      } else {
        // Show error toast
        showToast("Login failed. Please check your credentials.", "error");
        setFieldError(
          "general",
          "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Invalid email or password";
      setFieldError("general", errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get("code");
  //   const state = urlParams.get("state");

  //   if (code && state) {
  //     console.log("both code and state were caught", code);
  //     console.log("both code and state were caught", state);

  //     setLoading(true);
  //     const handleGitHubCallback = async () => {
  //       try {
  //         // Call your backend to exchange code for JWT
  //         const res = await authApi.githubCallback(code, state);
  //         if (res.status === 200) {
  //           const { jwt, user } = res.data;
  //           // Store token in both places for consistency
  //           localStorage.setItem("accessToken", jwt);
  //           localStorage.setItem("jwt", jwt);
  //           localStorage.setItem("userId", user.id);
  //           showToast("GitHub login successful!", "success");
  //           navigate("/dashboard", { replace: true });
  //         }
  //       } catch (error) {
  //         console.error("GitHub callback error:", error);
  //         showToast("GitHub login failed. Please try again.", "error");
  //         // Clean up URL
  //         navigate("/login", { replace: true });
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     handleGitHubCallback();
  //   }
  // }, [navigate, showToast]);

  const loginWithGithub = async () => {
    try {
      // Redirect to GitHub OAuth flow - no need to make an API call here
      // as the redirect will happen before any response is received
      window.location.href = `${import.meta.env.REACT_APP_URL}api/auth/github`;
      // The code below will not execute due to the redirect
    } catch (error) {
      console.log("GitHub login error:", error);
      showToast("Failed to initiate GitHub login.", "error");
    }
  };

  // Show loading indicator if loading or if code/state or token is present in URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const token = urlParams.get("token");
  if (loading || (code && state) || token) {
    return (
      <div className="min-h-screen w-full flex flex-1 items-center justify-center bg-primary text-white ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Logging in with GitHub...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-primary center mx-auto text-white px-4 sm:px-6 md:px-8">
        <div className=" group hover:border-2 hover:border-[#eee] transition-all duration-100 max-w-[450px] bg-secondary p-6 sm:p-8 md:p-10 rounded-[10px] shadow-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className=" flex items-center justify-center gap-2">
              <img src="/stackguard.png" alt="GitHub" className="h-8 w-8" />
              <span className="text-[24px] font-[400] font-inter ">
                StackGuard
              </span>
            </div>
          </div>
          {/* Welcome text */}
          <h2
            className="relative text-[30px] font-[500] mb-2 text-center font-inter transition-all duration-300 delay-100 
             after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full 
             after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:delay-150 
             group-hover:after:scale-x-100 after:bg-[linear-gradient(90deg,_#272DFF_0%,_rgba(54,_51,_89,_0.3)_100%)]"
          >
            Welcome to StackGuard
          </h2>

          <p className="text-[12px] font-[400] text-[#FFFFFF] text-center mb-6 font-inter ">
            Secure your codebase with advanced secret scanning and security best
            practices.
          </p>

          {/* Form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                {/* Email Field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm" htmlFor="email">
                      Email
                    </label>
                    <ErrorMessage name="email">
                      {(msg) => (
                        <div className="text-red-400 text-xs flex items-center">
                          <FiAlertCircle className="mr-1" /> {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    className={`w-full px-4 py-2 rounded-md bg-secondary text-white border ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]`}
                  />
                </div>

                {/* Password Field */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm text-[#7B7C82] hover:underline focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div
                    className={`relative flex items-center bg-secondary border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-[#ffffff]"
                    } rounded-md`}
                  >
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 bg-transparent text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-3 text-gray-400 hover:text-white focus:outline-none"
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="password">
                    {(msg) => (
                      <div className="text-red-400 text-xs mt-1 flex items-center">
                        <FiAlertCircle className="mr-1" /> {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* General Error */}
                <ErrorMessage name="general">
                  {(msg) => (
                    <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded-md flex items-center">
                      <FiAlertCircle className="mr-2" /> {msg}
                    </div>
                  )}
                </ErrorMessage>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-default hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="flex justify-center my-6">
            <div className="h-px bg-gray-600 w-[60px] sm:w-[80px] mt-3"></div>
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="h-px bg-gray-600 w-[60px] sm:w-[80px] mt-3"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md hover:bg-gray-200"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Google
            </button>
            <button
              onClick={() => loginWithGithub()}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-default border border-gray-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              <img src="/login/github.svg" alt="GitHub" className="h-5 w-5" />
              Github
            </button>
          </div>

          {/* Footer */}
          <p className="text-[12px] font-[400] font-inter  text-center text-[#FFFFFF] mt-6">
            By continuing, you agree to our{" "}
            <a href="/" className="text-[#9293CC] underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/" className="text-[#9293CC] underline">
              Privacy Policy
            </a>
          </p>
          <p className="text-[12px]  font-[400] font-inter  text-center text-[#FFFFFF] mt-2">
            New to StackGuard?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#9293CC] underline cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
