"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

interface OTPVerificationProps {
  mobileNumber: string;
  onVerify: (otp: string) => void;
  onResendOTP: () => void;
  isLoading: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  mobileNumber,
  onVerify,
  onResendOTP,
  isLoading,
}) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown > 0 && !canResend) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown, canResend]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newOtp = value.replace(/[^0-9]/g, "").substring(0, 6);
    setOtp(newOtp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  const handleResend = () => {
    if (canResend) {
      onResendOTP();
      setCountdown(60);
      setCanResend(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
        Verify your mobile number
      </h2>

      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        We&apos;ve sent a 6-digit verification code to{" "}
        <span className="font-medium text-neutral-800 dark:text-white">
          {mobileNumber}
        </span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Enter Verification Code
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={otp}
            onChange={handleChange}
            placeholder="Enter 6-digit code"
            className="block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-green-600 dark:focus:border-green-400 focus:outline-none text-center text-lg tracking-wider"
            maxLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={otp.length !== 6 || isLoading}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            "Verifying..."
          ) : (
            <>
              Verify <FiArrowRight className="ml-2" />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className={`font-medium ${
                canResend
                  ? "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                  : "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
              }`}
            >
              {canResend ? "Resend OTP" : `Resend in ${countdown}s`}
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default OTPVerification;
