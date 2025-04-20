"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthLayout from "@/layouts/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import OTPVerification from "@/components/auth/OTPVerification";
import Toast from "@/components/common/Toast";

type AuthMode = "signin" | "signup" | "otp-verification";
type ToastData = {
  type: "success" | "error" | "warning" | "info";
  message: string;
} | null;

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [mobileNumber, setMobileNumber] = useState("");
  const [toast, setToast] = useState<ToastData>(null);

  const handleSignIn = (data: { mobile: string; password: string }) => {
    setMobileNumber(data.mobile);
    setToast({
      type: "success",
      message: "OTP has been sent to your mobile number",
    });
    setAuthMode("otp-verification");
  };

  const handleSignUp = (data: {
    username: string;
    email: string;
    mobile: string;
    password: string;
  }) => {
    setMobileNumber(data.mobile);
    setToast({
      type: "success",
      message: "Account created! OTP has been sent for verification",
    });
    setAuthMode("otp-verification");
  };

  const handleVerifyOTP = (otp: string) => {
    console.log("Verifying OTP:", otp);
    setToast({
      type: "success",
      message: "OTP verified successfully! Redirecting to dashboard...",
    });

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
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
          />
        )}

        {authMode === "signup" && (
          <SignUpForm
            key="signup"
            onSwitchToSignIn={() => setAuthMode("signin")}
            onSubmit={handleSignUp}
          />
        )}

        {authMode === "otp-verification" && (
          <OTPVerification
            key="otp"
            mobileNumber={mobileNumber}
            onVerify={handleVerifyOTP}
            onResendOTP={handleResendOTP}
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
