"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMail, FiLock } from "react-icons/fi";
import Link from "next/link";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onSwitchToSignUp,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
        Sign in to your account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your email"
              className="focus:border-green-600 dark:focus:border-green-400 block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
            />
          </div>
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
              placeholder="Enter your password"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-green-600 dark:focus:border-green-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Link
            href="#"
            className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
          >
            Forgot your password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              Sign In <FiArrowRight className="ml-2" />
            </>
          )}
        </button>
        <div className="text-center mt-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
        <div className="text-center mt-2">
          <Link
            href="/auth/lawfirms"
            className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
          >
            Sign in as a law firm instead
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default SignInForm;
