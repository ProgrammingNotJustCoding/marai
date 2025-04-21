"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthLayout from "@/layouts/AuthLayout";
import MemberSignInForm from "@/components/auth/MemberSignInForm";
import Toast from "@/components/common/Toast";
import axios from "axios";
import { API_URL } from "@/utils/constants";

type ToastData = {
  type: "success" | "error" | "warning" | "info";
  message: string;
} | null;

const LawFirmAuthPage = () => {
  const [toast, setToast] = useState<ToastData>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (data: {
    credentials: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      console.log(
        "Making request to:",
        `${API_URL}/auth/lawfirm/member/signin/password`,
      );
      console.log(
        "With payload:",
        JSON.stringify(
          {
            credentials: data.credentials,
            password: data.password,
          },
          null,
          2,
        ),
      );

      const response = await axios({
        method: "post",
        url: `${API_URL}/auth/lawfirm/member/signin/password`,
        data: {
          credentials: data.credentials,
          password: data.password,
        },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response received:", response);

      if (response.status === 200) {
        localStorage.setItem("sessionId", response.data.sessionID);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("lawfirmId", response.data.user.lawFirmId);

        setToast({
          type: "success",
          message: "Signed in successfully! Redirecting to dashboard...",
        });

        setTimeout(() => {
          window.location.href = "/dashboard/lawyers";
        }, 2000);
      }
    } catch (error) {
      console.error("Error details:", {
        error,
      });
      const errorMessage =
        error.response?.data?.prettyMessage ||
        "Failed to sign in. Please check your credentials.";

      setToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeToast = () => setToast(null);

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        <MemberSignInForm
          key="lawfirm-signin"
          onSubmit={handleSignIn}
          isLoading={isLoading}
        />
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

export default LawFirmAuthPage;
