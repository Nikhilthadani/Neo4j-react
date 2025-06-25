import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useToaster } from "../../../contexts/ToasterContext";
import { authApi } from "../../../mocks/auth";
import images from '../../../constants/images';

// Validation Schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Full name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number is not valid")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    )
    .required("Password is required"),
});

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToaster();

  const initialValues = {
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Form data:", values);
      const res = await authApi.register(values);
      console.log("Response:", res);
      if (res.status === 201) {
        console.log("Account created successfully:", res.data);
        showToast("Account created successfully!", "success");
        resetForm();
        setTimeout(() => {
          setSubmitting(false);
          navigate("/login");
        }, 2000);
      } else {
        console.log("Error creating account:", res.data);
        showToast(res.data.message, "error");
        setSubmitting(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create account. Please try again.";
      showToast(errorMessage, "error");
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-primary text-white px-4 sm:px-6 md:px-8 py-4">
        <div className="hover:border-2 hover:border-[#eee] transition-all duration-100 max-w-[450px] bg-secondary p-6 sm:p-8 md:p-10 rounded-lg shadow-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="font-semibold flex items-center justify-center gap-2">
              <img src={images.stackguard} alt="Logo" className="h-8 w-8" />
              <span className="text-[24px] font-[400] font-inter">
                StackGuard
              </span>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {/* Full Name */}
                <div className="flex justify-between">
                  <label className="block text-sm mb-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <Field
                  name="fullName"
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2 mb-1 rounded-md bg-secondary text-white border ${
                    errors.fullName && touched.fullName
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]`}
                />

                {/* Phone Number */}
                <div className="flex justify-between mt-4">
                  <label className="block text-sm mb-1" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <Field
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  className={`w-full px-4 py-2 mb-1 rounded-md bg-secondary text-white border ${
                    errors.phoneNumber && touched.phoneNumber
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]`}
                />

                {/* Email */}
                <div className="flex justify-between mt-4">
                  <label className="block text-sm mb-1" htmlFor="email">
                    Email
                  </label>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <Field
                  name="email"
                  type="email"
                  placeholder="priyab@gmail.com"
                  className={`w-full px-4 py-2 mb-1 rounded-md bg-secondary text-white border ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]`}
                />

                {/* Password */}
                <div className="flex justify-between mt-4">
                  <label className="text-sm mb-1" htmlFor="password">
                    Password
                  </label>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div
                  className={`w-full mb-5 flex items-center justify-between bg-secondary border ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-[#ffffff]"
                  } rounded-md px-4 py-2`}>
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Set your password"
                    className="flex-1 bg-transparent text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-400 hover:text-white focus:outline-none">
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-default hover:bg-blue-700 text-white font-semibold py-2 rounded-md ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}>
                  {isSubmitting ? "Signing up..." : "Signup"}
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
              type="button"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md hover:bg-gray-200">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Google
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-default border border-gray-600 text-white py-2 rounded-md hover:bg-blue-700">
              <img src={images.github} alt="GitHub" className="h-5 w-5" />
              Github
            </button>
          </div>

          {/* Footer */}
          <p className="text-[12px] font-[400] font-inter text-center text-[#FFFFFF] mt-6">
            By continuing, you agree to our{" "}
            <a href="/" className="text-[#9293CC] underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/" className="text-[#9293CC] underline">
              Privacy Policy
            </a>
            .
          </p>
          <p className="text-[12px]  font-[400] font-inter  text-center text-[#FFFFFF] mt-2">
            Already have an account?{" "}
            <button
              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/login');
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
