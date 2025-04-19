"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiRefreshCw } from "react-icons/fi";

interface OTPVerificationProps {
  mobileNumber: string;
  onVerify: (otp: string) => void;
  onResendOTP: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  mobileNumber,
  onVerify,
  onResendOTP,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleInputChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      onResendOTP();
      setTimer(30);
      setCanResend(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 4) {
      onVerify(otpString);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
        Verify your number
      </h2>

      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        We&apos;ve sent a verification code to{" "}
        <span className="font-medium">{mobileNumber}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-300 dark:border-neutral-700 focus:border-green-600 dark:focus:border-green-400 focus:outline-none"
            />
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={!canResend}
            className={`flex items-center text-sm ${
              canResend
                ? "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                : "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
            }`}
          >
            <FiRefreshCw className={`mr-1 ${!canResend && "animate-spin"}`} />
            {canResend ? "Resend code" : `Resend code in ${timer}s`}
          </button>
        </div>

        <button
          type="submit"
          disabled={otp.some((digit) => !digit)}
          className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            otp.some((digit) => !digit)
              ? "bg-neutral-400 dark:bg-neutral-700 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          Verify <FiArrowRight className="ml-2" />
        </button>
      </form>
    </motion.div>
  );
};

export default OTPVerification;
