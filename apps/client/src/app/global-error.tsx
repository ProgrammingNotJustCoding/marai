"use client";

import React from "react";
import { FiRefreshCw, FiHome } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError: React.FC<GlobalErrorProps> = ({ error, reset }) => {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black text-neutral-900 dark:text-white min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md"
        >
          <div className="mb-8">
            <div className="inline-block p-4 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Something went wrong
          </h2>

          <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed mb-6">
            We&apos;re sorry, but an unexpected error has occurred.
          </p>

          {error.digest && (
            <p className="text-sm bg-neutral-100 dark:bg-neutral-800 p-3 rounded-md mb-8 font-mono break-all">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 text-white dark:text-neutral-900 rounded-md font-medium transition-colors w-full sm:w-auto"
            >
              <FiRefreshCw /> Try Again
            </button>

            <Link
              href="/"
              className="flex items-center hover:cursor-pointer justify-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md font-medium transition-colors w-full sm:w-auto"
            >
              <FiHome /> Back to Home
            </Link>
          </div>
        </motion.div>
      </body>
    </html>
  );
};

export default GlobalError;
