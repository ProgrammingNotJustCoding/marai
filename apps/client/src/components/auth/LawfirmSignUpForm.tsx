"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiPhone,
  FiLock,
  FiUser,
  FiMail,
  FiMapPin,
} from "react-icons/fi";

interface LawfirmSignUpFormProps {
  onSwitchToSignIn: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    address: string;
    mobile: string;
    password: string;
  }) => void;
  isLoading: boolean;
}

const LawfirmSignUpForm: React.FC<LawfirmSignUpFormProps> = ({
  onSwitchToSignIn,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatMobileNumber = (number: string) => {
    // Ensure mobile number has country code
    if (!number.startsWith("+")) {
      return `+${number}`;
    }
    return number;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      mobile: formatMobileNumber(formData.mobile),
    };
    onSubmit(formattedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
        Register Your Law Firm
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Create an account for your firm
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Firm Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-neutral-500" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your law firm's name"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-green-600 dark:focus:border-green-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-neutral-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your firm's email"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-green-600 dark:focus:border-green-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Office Address
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <FiMapPin className="text-neutral-500" />
            </div>
            <textarea
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your office address"
              rows={3}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-green-600 dark:focus:border-green-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Mobile Number (with country code)
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
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+919840121224"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-green-600 dark:focus:border-green-400 focus:outline-none"
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Include country code (e.g. +91 for India)
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-neutral-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-green-600 dark:focus:border-green-400 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            "Registering..."
          ) : (
            <>
              Register Law Firm <FiArrowRight className="ml-2" />
            </>
          )}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Already have a law firm account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default LawfirmSignUpForm;
