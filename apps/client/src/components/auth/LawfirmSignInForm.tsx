"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiPhone } from "react-icons/fi";
import Link from "next/link";

interface LawfirmSignInFormProps {
  onSwitchToSignUp: () => void;
  onSubmit: (mobile: string) => void;
  isLoading: boolean;
}

const LawfirmSignInForm: React.FC<LawfirmSignInFormProps> = ({
  onSwitchToSignUp,
  onSubmit,
  isLoading,
}) => {
  const [mobile, setMobile] = useState("");

  const formatMobileNumber = (number: string) => {
    // Ensure mobile number has country code
    if (!number.startsWith("+")) {
      return `+${number}`;
    }
    return number;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formatMobileNumber(mobile));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
        Law Firm Sign In
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Enter your mobile number to receive an OTP
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="text-neutral-500" />
            </div>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number with country code"
              className="focus:border-green-600 dark:focus:border-green-400 block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Include country code (e.g. +91 for India)
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !mobile}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            "Sending OTP..."
          ) : (
            <>
              Send OTP <FiArrowRight className="ml-2" />
            </>
          )}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Don&apos;t have a law firm account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
            >
              Register your firm
            </button>
          </p>
        </div>

        <div className="text-center mt-2">
          <Link
            href="/auth"
            className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
          >
            Sign in as a regular user instead
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default LawfirmSignInForm;
