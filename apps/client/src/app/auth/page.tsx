"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthLayout from "@/layouts/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import OTPVerification from "@/components/auth/OTPVerification";
import Toast from "@/components/common/Toast";
import axios from "axios";
import { API_URL } from "@/utils/constants";

type AuthMode = "signin" | "signup" | "otp-verification";
type ToastData = {
  type: "success" | "error" | "warning" | "info";
  message: string;
} | null;

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [mobileNumber, setMobileNumber] = useState("");
  const [toast, setToast] = useState<ToastData>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
  });

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/user/signin/password`,
        {
          email: data.email,
          password: data.password,
        },
      );

      if (response.status === 200) {
        setToast({
          type: "success",
          message: "Signed in successfully! Redirecting to dashboard...",
        });

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (error) {
      console.log("Error:", error);
      setToast({
        type: "error",
        message: "Failed to sign in. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: {
    username: string;
    email: string;
    mobile: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/user/signup`, {
        username: data.username,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });

      setUserData(data);
      setMobileNumber(data.mobile);

      setToast({
        type: "success",
        message: "Account created! Please verify your mobile number with OTP",
      });
      setAuthMode("otp-verification");
    } catch (error) {
      console.log("Error:", error);
      setToast({
        type: "error",
        message: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${API_URL}/auth/user/signup/mobile/verify`,
        {
          mobile: mobileNumber,
          otp: otp,
        },
        { withCredentials: true },
      );

      setToast({
        type: "success",
        message: "Phone verified successfully! Please sign in to continue.",
      });

      setTimeout(() => {
        setAuthMode("signin");
      }, 2000);
    } catch (error) {
      console.log("Error:", error);
      setToast({
        type: "error",
        message: "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setToast({
      type: "info",
      message: "A new OTP has been sent to your mobile number",
    });
  };

  const closeToast = () => setToast(null);

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {authMode === "signin" && (
          <SignInForm
            key="signin"
            onSwitchToSignUp={() => setAuthMode("signup")}
            onSubmit={handleSignIn}
            isLoading={isLoading}
          />
        )}

        {authMode === "signup" && (
          <SignUpForm
            key="signup"
            onSwitchToSignIn={() => setAuthMode("signin")}
            onSubmit={handleSignUp}
            isLoading={isLoading}
          />
        )}

        {authMode === "otp-verification" && (
          <OTPVerification
            key="otp"
            mobileNumber={mobileNumber}
            onVerify={handleVerifyOTP}
            onResendOTP={handleResendOTP}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>

      <Toast
        type={toast?.type || "info"}
        message={toast?.message || ""}
        isVisible={toast !== null}
        onClose={closeToast}
      />
    </AuthLayout>
  );
};

export default AuthPage;
