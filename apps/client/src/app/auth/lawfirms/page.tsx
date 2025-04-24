"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthLayout from "@/layouts/AuthLayout";
import LawfirmSignInForm from "@/components/auth/LawfirmSignInForm";
import LawfirmSignUpForm from "@/components/auth/LawfirmSignUpForm";
import OTPVerification from "@/components/auth/OTPVerification";
import Toast from "@/components/common/Toast";
import axios from "axios";
import { API_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";

type AuthMode = "signin" | "signup" | "otp-verification";
type FlowType = "signin" | "signup";

type ToastData = {
  type: "success" | "error" | "warning" | "info";
  message: string;
} | null;

const LawfirmAuthPage = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [flowType, setFlowType] = useState<FlowType>("signin");
  const [mobileNumber, setMobileNumber] = useState("");
  const [toast, setToast] = useState<ToastData>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lawfirmData, setLawfirmData] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    password: "",
  });

  const router = useRouter();

  const handleSignIn = async (mobile: string) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/lawfirm/signin/mobile/otp`, {
        mobile: mobile,
      });

      setMobileNumber(mobile);
      setFlowType("signin");
      setToast({
        type: "success",
        message: "OTP sent to your mobile number",
      });
      setAuthMode("otp-verification");
    } catch (error) {
      console.error("Error:", error);
      setToast({
        type: "error",
        message: "Failed to send OTP. Please check your mobile number.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: {
    name: string;
    email: string;
    address: string;
    mobile: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/lawfirm/signup`, {
        name: data.name,
        email: data.email,
        address: data.address,
        mobile: data.mobile,
        password: data.password,
      });

      setLawfirmData(data);
      setMobileNumber(data.mobile);
      setFlowType("signup");

      setToast({
        type: "success",
        message: "Account created! Please verify your mobile number with OTP",
      });
      setAuthMode("otp-verification");
    } catch (error) {
      console.error("Error:", error);
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
      console.log("flowType:", flowType);

      const endpoint =
        flowType === "signup"
          ? `/auth/lawfirm/signup/mobile/verify`
          : `/auth/lawfirm/signin/mobile/verify`;

      console.log("Using endpoint:", endpoint);

      const response = await axios.post(
        `${API_URL}${endpoint}`,
        {
          mobile: mobileNumber,
          otp: otp,
        },
        { withCredentials: true },
      );

      console.log("API Response:", response.data);

      if (flowType === "signup") {
        setToast({
          type: "success",
          message: "Phone verified successfully! Please sign in to continue.",
        });

        setTimeout(() => {
          setAuthMode("signin");
        }, 2000);
      } else {
        if (!response.data || !response.data.user) {
          console.error("Unexpected response structure:", response.data);
          setToast({
            type: "error",
            message: "Unexpected response from server. Please try again.",
          });
          return;
        }

        localStorage.setItem("sessionID", response.data.sessionID);
        localStorage.setItem("lawfirmId", response.data.user.id);
        localStorage.setItem("lawfirmName", response.data.user.name);

        const userData = response.data.user;
        localStorage.setItem("lawfirm", JSON.stringify(userData));

        setToast({
          type: "success",
          message: "Signed in successfully! Redirecting to dashboard...",
        });

        setTimeout(() => {
          if (userData.name && userData.name.toLowerCase() === "admin") {
            window.location.href = "/dashboard/admin";
          } else {
            window.location.href = "/dashboard/lawfirms";
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setToast({
        type: "error",
        message: "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const endpoint =
        flowType === "signup"
          ? `/auth/lawfirm/signup/mobile/otp`
          : `/auth/lawfirm/signin/mobile/otp`;

      await axios.post(`${API_URL}${endpoint}`, {
        mobile: mobileNumber,
      });

      setToast({
        type: "info",
        message: "A new OTP has been sent to your mobile number",
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      setToast({
        type: "error",
        message: "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeToast = () => setToast(null);

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {authMode === "signin" && (
          <LawfirmSignInForm
            key="signin"
            onSwitchToSignUp={() => setAuthMode("signup")}
            onSubmit={handleSignIn}
            isLoading={isLoading}
          />
        )}

        {authMode === "signup" && (
          <LawfirmSignUpForm
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

export default LawfirmAuthPage;
